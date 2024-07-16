#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if both a function name and API name were passed as arguments
if [ -z "$1" ]; then
    echo "No profile name provided. Using default profile: $DEFAULT_PROFILE_NAME"
    PROFILE_NAME=$DEFAULT_PROFILE_NAME
else
    PROFILE_NAME=$1
fi

excludedNames=(
    "winglang.bronifty.xyz"
    "cdk-hnb659fds-assets-851725517932-us-east-1"
    "aws-sam-cli-managed-default-samclisourcebucket-cn52sgxeu5ot"
    "nathanjmorton.xyz"
    "www.nathanjmorton.xyz"
)

allBuckets=$(aws s3api list-buckets --query "Buckets[].Name" --output text)

# Loop through each bucket
for bucket in $allBuckets; do
    # Check if the bucket is in the excluded list
    if [[ ! " ${excludedNames[@]} " =~ " ${bucket} " ]]; then
        echo "Emptying bucket: $bucket"
        aws s3 rm s3://$bucket --recursive --profile $PROFILE_NAME
        
        # Delete all versions of all objects in the bucket
        versions=$(aws s3api list-object-versions --bucket $bucket --query 'Versions[].{Key:Key,VersionId:VersionId}' --output text --profile $PROFILE_NAME)
        deleteMarkers=$(aws s3api list-object-versions --bucket $bucket --query 'DeleteMarkers[].{Key:Key,VersionId:VersionId}' --output text --profile $PROFILE_NAME)
        
        if [ -n "$versions" ]; then
            echo "Deleting all versions in bucket: $bucket"
            echo "$versions" | while read -r key versionId; do
                aws s3api delete-object --bucket $bucket --key "$key" --version-id "$versionId" --profile $PROFILE_NAME
            done
        fi

        if [ -n "$deleteMarkers" ]; then
            echo "Deleting all delete markers in bucket: $bucket"
            echo "$deleteMarkers" | while read -r key versionId; do
                aws s3api delete-object --bucket $bucket --key "$key" --version-id "$versionId" --profile $PROFILE_NAME
            done
        fi

        echo "Deleting bucket: $bucket"
        aws s3api delete-bucket --bucket $bucket --profile $PROFILE_NAME
    fi
done


################### this works but with some : in the terminal ###################
# #!/bin/bash
# # Get the directory where the script is located
# SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# # Source the scripts using the script directory path
# source $SCRIPT_DIR/../variables.sh

# # Check if both a function name and API name were passed as arguments
# if [ -z "$1" ]; then
#     echo "No profile name provided. Using default profile: $DEFAULT_PROFILE_NAME"
#     PROFILE_NAME=$DEFAULT_PROFILE_NAME
# else
#     PROFILE_NAME=$1
# fi

# excludedNames=(
#     "winglang.bronifty.xyz"
#     "cdk-hnb659fds-assets-851725517932-us-east-1"
#     "aws-sam-cli-managed-default-samclisourcebucket-cn52sgxeu5ot"
#     "nathanjmorton.xyz"
#     "www.nathanjmorton.xyz"
# )

# allBuckets=$(aws s3api list-buckets --query "Buckets[].Name" --output text)

# # Loop through each bucket
# for bucket in $allBuckets; do
#     # Check if the bucket is in the excluded list
#     if [[ ! " ${excludedNames[@]} " =~ " ${bucket} " ]]; then
#         echo "Emptying bucket: $bucket"
#         aws s3 rm s3://$bucket --recursive --profile $PROFILE_NAME
        
#         # Delete all versions of all objects in the bucket
#         versions=$(aws s3api list-object-versions --bucket $bucket --query 'Versions[].{Key:Key,VersionId:VersionId}' --output text --profile $PROFILE_NAME)
#         deleteMarkers=$(aws s3api list-object-versions --bucket $bucket --query 'DeleteMarkers[].{Key:Key,VersionId:VersionId}' --output text --profile $PROFILE_NAME)
        
#         if [ -n "$versions" ]; then
#             echo "Deleting all versions in bucket: $bucket"
#             while read -r key versionId; do
#                 aws s3api delete-object --bucket $bucket --key "$key" --version-id "$versionId" --profile $PROFILE_NAME
#             done <<< "$versions"
#         fi

#         if [ -n "$deleteMarkers" ]; then
#             echo "Deleting all delete markers in bucket: $bucket"
#             while read -r key versionId; do
#                 aws s3api delete-object --bucket $bucket --key "$key" --version-id "$versionId" --profile $PROFILE_NAME
#             done <<< "$deleteMarkers"
#         fi

#         echo "Deleting bucket: $bucket"
#         aws s3api delete-bucket --bucket $bucket --profile $PROFILE_NAME
#     fi
# done

############ this works ###################

# #!/bin/bash
# # Get the directory where the script is located
# SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# # Source the scripts using the script directory path
# source $SCRIPT_DIR/../variables.sh

# # Check if both a function name and API name were passed as arguments
# if [ -z "$1" ]; then
#     echo "No profile name provided. Using default profile: $DEFAULT_PROFILE_NAME"
#     PROFILE_NAME=$DEFAULT_PROFILE_NAME
# else
#     PROFILE_NAME=$1
# fi

#   excludedNames=(
#     "winglang.bronifty.xyz"
#     "cdk-hnb659fds-assets-851725517932-us-east-1"
#     "aws-sam-cli-managed-default-samclisourcebucket-cn52sgxeu5ot"
#     "nathanjmorton.xyz"
#     "www.nathanjmorton.xyz"
# )

# allBuckets=$(aws s3api list-buckets --query "Buckets[].Name" --output text)

# # Loop through each bucket
# for bucket in $allBuckets; do
#     # Check if the bucket is in the excluded list
#     if [[ ! " ${excludedNames[@]} " =~ " ${bucket} " ]]; then
#         echo "Emptying bucket: $bucket"
#         aws s3 rm s3://$bucket --recursive --profile $PROFILE_NAME
#         echo "Deleting bucket: $bucket"
#         aws s3api delete-bucket --bucket $bucket --profile $PROFILE_NAME
#     fi
# done