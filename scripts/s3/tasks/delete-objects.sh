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


# List all objects in the bucket
objects=$(aws s3api list-objects --profile $PROFILE_NAME --bucket $BUCKET_NAME --query 'Contents[].{Key: Key}' --output text)

# Check if the bucket is not empty
if [ -n "$objects" ]; then
    echo "Deleting objects in bucket: $BUCKET_NAME"

    # Delete all objects in the bucket
    while read -r key; do
        aws s3api delete-object --profile $PROFILE_NAME --bucket $BUCKET_NAME --key "$key"
    done <<< "$objects"

    echo "Objects deleted in bucket: $BUCKET_NAME"
else
echo "Bucket $BUCKET_NAME is empty or does not exist."
fi



