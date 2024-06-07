# install prereq
npm install -g aws-cdk
which cdk
npm i -g typescript
which tsc
which tsserver

# cdk bootstrap
cdk bootstrap aws://851725517932/us-east-1

ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
REGION=$(aws configure get region)
cdk bootstrap aws://$ACCOUNT_ID/$REGION

