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
   

# Define the stack status filter for extant stacks
STACK_STATUS_FILTER="CREATE_IN_PROGRESS CREATE_FAILED CREATE_COMPLETE ROLLBACK_IN_PROGRESS ROLLBACK_FAILED ROLLBACK_COMPLETE DELETE_FAILED UPDATE_IN_PROGRESS UPDATE_COMPLETE_CLEANUP_IN_PROGRESS UPDATE_COMPLETE UPDATE_ROLLBACK_IN_PROGRESS UPDATE_ROLLBACK_FAILED UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS UPDATE_ROLLBACK_COMPLETE REVIEW_IN_PROGRESS IMPORT_IN_PROGRESS IMPORT_COMPLETE IMPORT_ROLLBACK_IN_PROGRESS IMPORT_ROLLBACK_FAILED IMPORT_ROLLBACK_COMPLETE"

echo "aws cloudformation list-stacks --profile $PROFILE_NAME"
aws cloudformation list-stacks --profile $PROFILE_NAME --stack-status-filter $STACK_STATUS_FILTER --query 'StackSummaries[*].StackName' --output text


