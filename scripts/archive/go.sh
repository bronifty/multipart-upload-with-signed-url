#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source "$SCRIPT_DIR/variables.sh"


# # download and install go
curl -fsSL -o go"${GOLANG_VERSION}".linux-amd64.tar.gz https://go.dev/dl/go"${GOLANG_VERSION}".linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go"${GOLANG_VERSION}".linux-amd64.tar.gz
# cleanup go
sudo rm go"${GOLANG_VERSION}".linux-amd64.tar.gz

cat << EOF >> ~/.bashrc

alias gitpushmain="git branch -M main && git add . && git commit -am 'this' && git push -u origin main"

export PATH=\$PATH:/usr/local/go/bin
export GOPATH=\$(echo \$(go env GOPATH))
export PATH=\$PATH:\$GOPATH/bin

EOF

source ~/.bashrc
which go

