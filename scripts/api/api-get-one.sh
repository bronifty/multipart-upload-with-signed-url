# # #!/bin/bash
# # # Get the directory where the script is located
# # SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# # # Source the scripts using the script directory path
# # source $SCRIPT_DIR/../variables.sh

# # # Check if an API ID was passed as an argument
# # if [ -z "$1" ]; then
# #     echo "No API ID provided. Exiting."
# #     exit 1
# # else
# #     API_ID=$1  # Set the API ID from the first script argument
# # fi

# # aws apigatewayv2 get-api --api-id $API_ID 


# #!/bin/bash
# # Get the directory where the script is located
# SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# # Source the scripts using the script directory path
# source $SCRIPT_DIR/../variables.sh

# # Check if an API name was passed as an argument
# if [ -z "$1" ]; then
#     echo "No API name provided. Using default API name:  $DEFAULT_API_NAME"
#     API_NAME=$DEFAULT_API_NAME
# else
#     API_NAME=$1  # Set the API name from the first script argument
# fi

# # List all APIs and filter by name to find the API ID
# API_ID=$(aws apigatewayv2 get-apis | jq -r --arg API_NAME "$API_NAME" '.Items[] | select(.Name == $API_NAME) | .ApiId')

# if [ -z "$API_ID" ]; then
#     echo "API with name '$API_NAME' not found."
#     exit 1
# else
#     aws apigatewayv2 get-api --api-id $API_ID
# fi

#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if an API name was passed as an argument
if [ -z "$1" ]; then
    echo "No API name provided. Using default API name: $DEFAULT_API_NAME"
    API_NAME=$DEFAULT_API_NAME
else
    API_NAME=$1  # Set the API name from the first script argument
fi

# List all APIs and filter by name to find the API ID
API_ID=$(aws apigatewayv2 get-apis | jq -r --arg API_NAME "$API_NAME" '.Items[] | select(.Name == $API_NAME) | .ApiId')

if [ -z "$API_ID" ]; then
    echo "API with name '$API_NAME' not found."
    exit 1
else
    # Construct the ARN for the API
    REGION=$(aws configure get region)
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    API_ARN="arn:aws:apigateway:$REGION::$ACCOUNT_ID:/apis/$API_ID"

    # Use the ARN to get the API details
    echo "Fetching details for API ARN: $API_ARN"
    aws apigatewayv2 get-api --api-id $API_ID
fi