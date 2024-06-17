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

account_id=$(aws sts get-caller-identity --profile $PROFILE_NAME --query "Account" --output text)
region=$(aws configure get region --profile $PROFILE_NAME)

pnpx cdk bootstrap aws://$account_id/$region
