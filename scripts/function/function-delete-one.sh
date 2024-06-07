#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

  # Check if a function name was passed as an argument
   if [ -z "$1" ]; then
       echo "No function name provided. Using default function name."
       FUNCTION_NAME=$DEFAULT_FUNCTION_NAME
   else
       FUNCTION_NAME=$1  # Set the function name from the first script argument
   fi

# Delete a function function given its name
function_name=$1
aws lambda delete-function --function-name "$function_name"