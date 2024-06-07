#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source "$SCRIPT_DIR/variables.sh"


# Update and install necessary packages without interactive prompts
sudo DEBIAN_FRONTEND=noninteractive apt-get update -y && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y git curl unzip wget vim jq lsof htop build-essential gnupg software-properties-common python3-pip snapd xclip && sudo snap install auto-cpufreq && sudo auto-cpufreq --install

# setup github and ssh key (automatically without user interaction, using default file location, no passphrase)
git config --global user.name "bronifty"
git config --global user.email "bronifty@gmail.com"
ssh-keygen -t rsa -b 4096 -C "bronifty@gmail.com" -N ""


