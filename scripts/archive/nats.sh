#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source "$SCRIPT_DIR/variables.sh"


# nats-server-v2.11.0-preview.1-386.deb 
go install github.com/nats-io/nats-server/v2@latest

# cat << EOF >> ~/.bashrc
# export GOPATH=\$(echo $(go env GOPATH))
# export PATH=\$PATH:\$GOPATH/bin
# EOF

# download and install nats client
curl -fsSL -o nats-cli.deb https://github.com/nats-io/natscli/releases/download/v"${NATS_CLI_VERSION}"/nats-"${NATS_CLI_VERSION}"-amd64.deb 
sudo DEBIAN_FRONTEND=noninteractive dpkg -i nats-cli.deb
# cleanup nats client
sudo DEBIAN_FRONTEND=noninteractive rm nats-cli.deb


# download nats-server unzip and cp to /usr/local/bin
# curl -L https://github.com/nats-io/nats-server/releases/download/v"${NATS_SERVER_VERSION}"/nats-server-v"${NATS_SERVER_VERSION}"-linux-amd64.zip -o nats-server.zip
# sleep 1
# sudo unzip -o nats-server.zip -d nats-server-dir
# sudo cp nats-server-dir/nats-server-v"${NATS_SERVER_VERSION}"-linux-amd64/nats-server /usr/local/bin/
# # cleanup nats-server
# sudo rm -rf nats-server.zip nats-server-dir