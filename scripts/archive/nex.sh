#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source "$SCRIPT_DIR/variables.sh"


curl -sSf https://nex.synadia.com/install.sh | sudo DEBIAN_FRONTEND=noninteractive sh