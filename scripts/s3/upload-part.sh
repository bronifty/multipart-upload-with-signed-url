#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if both a function name and API name were passed as arguments
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ] || [ -z "$5" ]; then
    echo "Usage: $0 <PROFILE_NAME> <BUCKET_NAME> <KEY_NAME> <UPLOAD_ID> <PART_NUMBER>"
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
    if [ -z "$4" ]; then
        echo "No upload ID provided."
        exit 1
    else
        UPLOAD_ID=$4
    fi
    if [-z "$5"]; then
        echo "No part number provided; using default part number 1"
        PART_NUMBER=1
    else 
        PART_NUMBER=$5
    fi
else
    PROFILE_NAME=$1      # Set the API name from the second script argument
    BUCKET_NAME=$2  # Set the function name from the first script argument
    KEY_NAME=$3
    UPLOAD_ID=$4
    PART_NUMBER=$5
fi

echo "aws s3api upload-part --profile $PROFILE_NAME --bucket $BUCKET_NAME --key '$KEY_NAME' --part-number $PART_NUMBER --body $SCRIPT_DIR/$KEY_NAME --upload-id  '$UPLOAD_ID'"
aws s3api upload-part --profile $PROFILE_NAME --bucket $BUCKET_NAME --key '$KEY_NAME' --part-number $PART_NUMBER --body $SCRIPT_DIR/$KEY_NAME --upload-id  "$UPLOAD_ID"

