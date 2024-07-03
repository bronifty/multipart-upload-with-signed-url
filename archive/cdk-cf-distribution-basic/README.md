```sh
#!/bin/bash
# Check if both a function name and API name were passed as arguments
if [ -z "$1" ]; then
    echo "No profile name provided. Using default profile: default"
    PROFILE_NAME="default"
else
    PROFILE_NAME=$1
fi

account_id=$(aws sts get-caller-identity --profile $PROFILE_NAME --query "Account" --output text)
region=$(aws configure get region --profile $PROFILE_NAME)

pnpx cdk bootstrap aws://$account_id/$region

```
