#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../../variables.sh

# Check if both a function name and API name were passed as arguments

if [ -z "$1" ]; then
    echo "No profile name provided. Using default profile: $DEFAULT_PROFILE_NAME"
    PROFILE_NAME=$DEFAULT_PROFILE_NAME
else
    PROFILE_NAME=$1
fi


# List all buckets
buckets=$(aws s3api list-buckets --profile $PROFILE_NAME --query "Buckets[].Name" --output text)


# Loop through each bucket
for bucket in $buckets; do
    echo "Checking bucket: $bucket"

    # List all object versions in the bucket
    versions=$(aws s3api list-object-versions --bucket $bucket --query 'Versions[].{Key: Key, VersionId: VersionId}' --output text)

    # Check if there are any versions to delete
    if [ -n "$versions" ]; then
        echo "Deleting object versions in bucket: $bucket"

        # Delete all object versions in the bucket
        while read -r key versionId; do
            echo "Deleting version $versionId of object: $key from bucket: $bucket"
            aws s3api delete-object --bucket "$bucket" --key "$key" --version-id "$versionId"
        done <<< "$versions"

        echo "Object versions deleted in bucket: $bucket"
    else
        echo "No versions to delete in bucket: $bucket"
    fi
done



# # Loop through each bucket
# for bucket in $buckets; do
#     echo "Checking bucket: $bucket"

#     # List all objects in the bucket
#     objects=$(aws s3api list-objects --bucket $bucket --query 'Contents[].{Key: Key}' --output text)

#     # Check if the bucket is not empty
#     if [ -n "$objects" ]; then
#         echo "Deleting objects in bucket: $bucket"

#         # Delete all objects in the bucket
#         while read -r key; do
#             echo "Deleting object: $key from bucket: $bucket"
#             aws s3api delete-object --bucket "$bucket" --key "$key"
#         done <<< "$objects"

#         echo "Objects deleted in bucket: $bucket"
#     else
#         echo "Bucket $bucket is empty or does not exist."
#     fi
# done



