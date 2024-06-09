#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if both a function name and API name were passed as arguments
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <PROFILE_NAME> <BUCKET_NAME> <KEY_NAME>"
    if [ -z "$1" ]; then
        echo "No profile name provided. Using default profile: $DEFAULT_PROFILE_NAME"
        PROFILE_NAME=$DEFAULT_PROFILE_NAME
    else
        PROFILE_NAME=$1
    fi
    if [ -z "$2" ]; then
        echo "No bucket name provided."
        exit 1
    else
        BUCKET_NAME=$2
    fi
    if [ -z "$3" ]; then
        echo "No key name provided."
        exit 1
    else
        KEY_NAME=$3
    fi
else
    PROFILE_NAME=$1      # Set the API name from the second script argument
    BUCKET_NAME=$2  # Set the function name from the first script argument
    KEY_NAME=$3
fi

aws s3api create-multipart-upload --profile $PROFILE_NAME --bucket $BUCKET_NAME --key $KEY_NAME


# {
#     "ServerSideEncryption": "AES256",
#     "Bucket": "bronifty-sst",
#     "Key": "multipart/01",
#     "UploadId": "MECpkMFSkqJhKOja6i0EkGKax1avQY90hyMFuf61g_tPC0mIttxNYrQ0k3d0A1ghrNHzpA9274asd92dHn1gmK1RpmvJg0.fSMY0aVSXBAPTV2VvGrTqQcLo47_ZDUOe"
# }



#    aws s3api create-multipart-upload --bucket my-bucket --key 'my-large-file.zip'

#       aws s3api upload-part --bucket my-bucket --key 'my-large-file.zip' --part-number 1 --body file_part1 --upload-id <from-create-multipart-upload>

#    aws s3api complete-multipart-upload --multipart-upload file://multipart-manifest.json --bucket my-bucket --key 'my-large-file.zip' --upload-id <from-create-multipart-upload>

#    {
#   "Parts": [
#     {
#       "ETag": "\"etag1\"",
#       "PartNumber": 1
#     },
#     {
#       "ETag": "\"etag2\"",
#       "PartNumber": 2
#     }
#   ]
# }


   aws s3api create-multipart-upload --bucket my-bucket --key 'my-large-file.zip'

      aws s3api upload-part --bucket my-bucket --key 'my-large-file.zip' --part-number 1 --body file_part1 --upload-id <from-create-multipart-upload>
   aws s3api upload-part --bucket my-bucket --key 'my-large-file.zip' --part-number 2 --body file_part2 --upload-id <from-create-multipart-upload>

      aws s3api complete-multipart-upload --multipart-upload file://multipart-manifest.json --bucket my-bucket --key 'my-large-file.zip' --upload-id <from-create-multipart-upload>


filesize=$(stat -c %s my-large-file.zip)
partsize=$((filesize / 2))

# Extract the first part
dd if=my-large-file.zip of=part1 bs=1 count=$partsize

# Extract the second part
dd if=my-large-file.zip of=part2 bs=1 skip=$partsize count=$partsize

#!/bin/bash

# Variables
BUCKET_NAME="my-bucket"
KEY_NAME="my-large-file.zip"
FILE_NAME="my-large-file.zip"
PART_SIZE=5242880  # 5 MB in bytes, adjust as necessary

# Start multipart upload and get upload ID
UPLOAD_ID=$(aws s3api create-multipart-upload --bucket $BUCKET_NAME --key $KEY_NAME --query 'UploadId' --output text)

# Function to upload a part
upload_part() {
    PART_NUMBER=$1
    FILE_PART=$2
    aws s3api upload-part --bucket $BUCKET_NAME --key $KEY_NAME --part-number $PART_NUMBER --body $FILE_PART --upload-id $UPLOAD_ID
}

# Extract and upload part 1
dd if=$FILE_NAME of=part1 bs=1 count=$PART_SIZE
ETAG1=$(upload_part 1 part1 | jq -r .ETag)

# Extract and upload part 2
dd if=$FILE_NAME of=part2 bs=1 skip=$PART_SIZE count=$PART_SIZE
ETAG2=$(upload_part 2 part2 | jq -r .ETag)

# Complete the multipart upload
aws s3api complete-multipart-upload --multipart-upload 'Parts=[{ETag=$ETAG1,PartNumber=1},{ETag=$ETAG2,PartNumber=2}]' --bucket $BUCKET_NAME --key $KEY_NAME --upload-id $UPLOAD_ID


#!/bin/bash

# Variables
FILE_NAME="my-large-file.zip"
PART_SIZE=5242880  # 5 MB in bytes

# Calculate the file size in bytes
filesize=$(stat -c %s "$FILE_NAME")

# Calculate the number of parts
num_parts=$(( (filesize + PART_SIZE - 1) / PART_SIZE ))

echo "Number of parts: $num_parts"