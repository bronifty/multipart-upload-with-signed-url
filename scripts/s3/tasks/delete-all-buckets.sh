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
    echo "Deleting bucket: $bucket"
    aws s3 rb s3://$bucket --profile $PROFILE_NAME --force
done

# aws s3 rb s3://<bucket-name> --force

