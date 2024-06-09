#!/bin/bash
echo "aws s3api delete-bucket --profile sst --bucket $1 --region us-east-1"
aws s3api delete-bucket --profile sst --bucket $1 --region us-east-1


