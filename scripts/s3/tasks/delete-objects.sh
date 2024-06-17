#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../../variables.sh

# Check if both a function name and API name were passed as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <PROFILE_NAME> <BUCKET_NAME>"
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
else
    PROFILE_NAME=$1      # Set the API name from the second script argument
    BUCKET_NAME=$2  # Set the function name from the first script argument
fi

aws s3api list-object-versions --profile $PROFILE_NAME --bucket $BUCKET_NAME | \
   jq -e '.Versions[]? | {Key:.Key, VersionId:.VersionId}' | \
   while read -r obj; do
       KEY=$(echo $obj | jq -r .Key);
       VERSION_ID=$(echo $obj | jq -r .VersionId);
       if [[ -n "$KEY" && -n "$VERSION_ID" ]]; then
           aws s3api delete-object --bucket $BUCKET_NAME --key "$KEY" --version-id "$VERSION_ID";
       else
           echo "Invalid or empty KEY or VERSION_ID: KEY='$KEY', VERSION_ID='$VERSION_ID'"
       fi
   done

#!/bin/bash

# List all buckets
buckets=$(aws s3api list-buckets --query "Buckets[].Name" --output text)

# Loop through each bucket
for bucket in $buckets; do
    echo "Checking bucket: $bucket"

    # List all objects in the bucket
    objects=$(aws s3api list-objects --bucket $bucket --query 'Contents[].{Key: Key}' --output text)

    # Check if the bucket is not empty
    if [ -n "$objects" ]; then
        echo "Deleting objects in bucket: $bucket"

        # Delete all objects in the bucket
        while read -r key; do
            aws s3api delete-object --bucket "$bucket" --key "$key"
        done <<< "$objects"

        echo "Objects deleted in bucket: $bucket"
    else
        echo "Bucket $bucket is empty or does not exist."
    fi
done



