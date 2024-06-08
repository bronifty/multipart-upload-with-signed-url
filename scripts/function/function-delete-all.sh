#!/bin/bash

# Pipe the output of get_all_apis.sh to api_delete_one.sh to delete all API Gateways
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

"$SCRIPT_DIR/function-get-all.sh" | while read FUNCTION_NAME; do
  echo "Deleting function with name: $FUNCTION_NAME"
  "$SCRIPT_DIR/function-delete-one.sh" "$FUNCTION_NAME"
done


