# This script will find all files in the current directory that contain "lambda" in their names and replace "lambda" with "function" using parameter expansion. Make sure you are in the directory where the files are located before running this script.
for file in *lambda*; do
  mv "$file" "${file//lambda/function}"
done
# change underscore _ to hyphen - in fs
for file in *_*; do
  mv "$file" "${file//_/-}"
done
# change underscore to hyphen in file
sed -i '' 's/_/-/g' Makefile
