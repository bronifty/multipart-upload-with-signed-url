#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if both a function name and API name were passed as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <FILE_NAME> <PART_SIZE>"
    if [ -z "$1" ]; then
        echo "No file name provided."
        exit 1
    else
        FILE_NAME=$1
    fi
    if [ -z "$2" ]; then
        echo "No part size provided. using default 5MB"
        PART_SIZE=5242880
    else
        PART_SIZE=$2
    fi
else
    FILE_NAME=$1      # Set the API name from the second script argument
    PART_SIZE=$2  # Set the function name from the first script argument
fi


# Calculate the file size in bytes
filesize=$(stat -c %s "$FILE_NAME")

# Calculate the number of parts
num_parts=$(( (filesize + PART_SIZE - 1) / PART_SIZE ))

echo "Number of parts: $num_parts"