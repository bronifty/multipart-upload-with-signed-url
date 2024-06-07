#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if both account ID and region are provided as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <aws-account-id> <region>"
  exit 1
fi

# Use the provided account ID and region to bootstrap CDK
pnpx cdk bootstrap "aws://$1/$2"