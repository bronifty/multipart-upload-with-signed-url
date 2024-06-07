#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/variables.sh

# Clean previous installs
source $SCRIPT_DIR/clean.sh

cd $SCRIPT_DIR/../app
# Install development dependencies
pnpm install 
pnpm dev
