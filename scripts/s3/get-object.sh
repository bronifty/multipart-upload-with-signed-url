#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if both a function name and API name were passed as arguments
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
    echo "Usage: $0 <PROFILE_NAME> <BUCKET_NAME> <KEY_NAME> <LOCAL_FILE_NAME>"
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
        echo "No local file name provided."
        exit 1
    else
        LOCAL_FILE_NAME=$4
    fi
else
    PROFILE_NAME=$1      # Set the API name from the second script argument
    BUCKET_NAME=$2  # Set the function name from the first script argument
    KEY_NAME=$3
    LOCAL_FILE_NAME=$4
fi


aws s3api get-object --profile $PROFILE_NAME --bucket $BUCKET_NAME --key $KEY_NAME $LOCAL_FILE_NAME

