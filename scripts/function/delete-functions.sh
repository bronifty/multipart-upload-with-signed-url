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
    ""
    "" 
)

allFunctions=$(aws lambda list-functions --query "Functions[].FunctionName" --output text)

# Loop through each bucket
for function in $allFunctions; do
    # Check if the bucket is in the excluded list
    if [[ ! " ${excludedNames[@]} " =~ " ${function} " ]]; then
        echo "Deleting function: $function"
        aws lambda delete-function --function-name $function --profile $PROFILE_NAME
    fi
done