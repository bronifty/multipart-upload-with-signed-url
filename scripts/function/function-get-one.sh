# #!/bin/bash
# # Get the directory where the script is located
# SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# # Source the scripts using the script directory path
# source $SCRIPT_DIR/../variables.sh

# # Check if a function name was passed as an argument
# if [ -z "$1" ]; then
#     echo "No function name provided. Using default function name."
#     FUNCTION_NAME=$DEFAULT_FUNCTION_NAME
# else
#     FUNCTION_NAME=$1  # Set the function name from the first script argument
# fi

# # Get the function configuration
# aws lambda get-function-configuration --function-name $FUNCTION_NAME

#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if a function name was passed as an argument
if [ -z "$1" ]; then
    echo "No function name provided. Using default function name: $DEFAULT_FUNCTION_NAME"
    FUNCTION_NAME=$DEFAULT_FUNCTION_NAME
else
    FUNCTION_NAME=$1  # Set the function name from the first script argument
fi

# List all functions and filter by name to find the function configuration
FUNCTION_ARN=$(aws lambda list-functions | jq -r --arg FUNCTION_NAME "$FUNCTION_NAME" '.Functions[] | select(.FunctionName == $FUNCTION_NAME) | .FunctionArn')

if [ -z "$FUNCTION_ARN" ]; then
    echo "Function with name '$FUNCTION_NAME' not found."
    exit 1
else
    aws lambda get-function-configuration --function-name $FUNCTION_ARN
fi


# aws lambda list-functions
# {
#   "Functions": [
#     {
#       "FunctionName": "function",
#       "FunctionArn": "arn:aws:lambda:us-east-1:851725517932:function:function",
#       "Runtime": "nodejs20.x",
#       "Role": "arn:aws:iam::851725517932:role/lambda-full-access",
#       "Handler": "index.handler",
#       "CodeSize": 3327808,
#       "Description": "",
#       "Timeout": 3,
#       "MemorySize": 128,
#       "LastModified": "2024-06-01T03:58:53.971+0000",
#       "CodeSha256": "tulU60LvHUsDyid6TjB1Q8rg9lR+b9YMVgMgllCv7EI=",
#       "Version": "$LATEST",
#       "TracingConfig": {
#         "Mode": "PassThrough"
#       },
#       "RevisionId": "5c44ac30-8ccb-4a7e-81ba-9b4f8cc8cf26",
#       "PackageType": "Zip",
#       "Architectures": [
#         "x86_64"
#       ],
#       "EphemeralStorage": {
#         "Size": 512
#       },
#       "SnapStart": {
#         "ApplyOn": "None",
#         "OptimizationStatus": "Off"
#       },
#       "LoggingConfig": {
#         "LogFormat": "Text",
#         "LogGroup": "/aws/lambda/function"
#       }
#     }
#   ]
# }