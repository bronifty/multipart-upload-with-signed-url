#!/bin/bash

# Pipe the output of get_all_functions.sh to delete_function.sh to delete all function functions
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

"$SCRIPT_DIR/function_get_all.sh" | while read function_name; do
  "$SCRIPT_DIR/function_delete_one.sh" "$function_name"
  done