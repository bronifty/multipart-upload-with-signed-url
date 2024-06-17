#!/bin/bash

# List all buckets
buckets=$(aws s3api list-buckets --query "Buckets[].Name" --output text)

# Loop through each bucket
for bucket in $buckets; do
    echo "Checking bucket: $bucket"

    # List all objects in the bucket
    objects=$(aws s3api list-objects --query 'Contents[].{Key: Key}' --output text)

    # Check if the bucket is not empty
    if [ -n "$objects" ]; then
        echo "Deleting objects in bucket: $bucket"

        # Delete all objects in the bucket
        while read -r key version; do
            aws s3api delete-object --bucket "$bucket" --key "$key" --version-id "$version"
        done <<< "$objects"

        echo "Objects deleted in bucket: $bucket"
    else
        echo "Bucket $bucket is empty or does not exist."
    fi
done

# #!/bin/bash

# buckets=$(aws s3api list-buckets --query "Buckets")
# echo $buckets

# for bucket in $buckets; do
#     echo attempting to delete bucket: $bucket
#     aws s3api delete-bucket --bucket $bucket
# done


