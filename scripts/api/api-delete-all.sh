#!/bin/bash

# Pipe the output of get_all_apis.sh to api_delete_one.sh to delete all API Gateways
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

"$SCRIPT_DIR/api_get_all.sh" | while read API_ID; do
  echo "Deleting API with ID: $API_ID"
  "$SCRIPT_DIR/api_delete_one.sh" "$API_ID"
done