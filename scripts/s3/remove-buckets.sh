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
)

allBuckets=$(aws s3api list-buckets --query "Buckets[].Name" --output text)

# Loop through each bucket
for bucket in $allBuckets; do
    # Check if the bucket is in the excluded list
    if [[ ! " ${excludedNames[@]} " =~ " ${bucket} " ]]; then
        echo "Emptying bucket: $bucket"
        aws s3 rm s3://$bucket --recursive --profile $PROFILE_NAME
        echo "Deleting bucket: $bucket"
        aws s3api delete-bucket --bucket $bucket --profile $PROFILE_NAME
    fi
done