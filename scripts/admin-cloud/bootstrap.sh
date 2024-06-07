#!/bin/bash
# cdk bootstrap aws://851725517932/us-east-1
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

account_id=$(aws sts get-caller-identity --query "Account" --output text)
region=$(aws configure get region)
./scripts/cloud-admin/cdk.sh $account_id $region


