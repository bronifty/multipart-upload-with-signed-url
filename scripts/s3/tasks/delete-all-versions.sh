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


# List all object versions in the bucket
versions=$(aws s3api list-object-versions --bucket $BUCKET_NAME --profile $PROFILE_NAME --query 'Versions[].{Key: Key, VersionId: VersionId}' --output text)

# Check if there are any versions to delete
if [ -n "$versions" ]; then
    echo "Deleting object versions in bucket: $BUCKET_NAME"

    # Delete all object versions in the bucket
    while read -r key versionId; do
        echo "Deleting version $versionId of object: $key from bucket: $BUCKET_NAME"
        aws s3api delete-object --bucket "$BUCKET_NAME" --key "$key" --version-id "$versionId"
    done <<< "$versions"

    echo "Object versions deleted in bucket: $BUCKET_NAME"
else
    echo "No versions to delete in bucket: $BUCKET_NAME"
fi