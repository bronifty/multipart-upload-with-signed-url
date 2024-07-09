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
if [ -z "$2" ]; then
    echo "No stack name provided. Exiting..."
    exit 1
else
    STACK_NAME=$2
fi
   
echo "aws cloudformation delete-stack --stack-name $STACK_NAME --profile $PROFILE_NAME"
aws cloudformation delete-stack --stack-name $STACK_NAME --profile $PROFILE_NAME




