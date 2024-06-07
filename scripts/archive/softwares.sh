#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source "$SCRIPT_DIR/variables.sh"


# # aws cli
# curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# unzip awscliv2.zip
# sudo DEBIAN_FRONTEND=noninteractive ./aws/install
# sudo DEBIAN_FRONTEND=noninteractive rm -rf awscliv2.zip ./aws/

# Navigate back to the original directory if needed
# cd -


# # aws cli
# curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# unzip awscliv2.zip
# sudo ./aws/install
# rm -rf awscliv2.zip ./aws/

# terraform
sudo DEBIAN_FRONTEND=noninteractive apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y gnupg software-properties-common
wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
gpg --no-default-keyring \
--keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
--fingerprint
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo DEBIAN_FRONTEND=noninteractive apt update && sudo DEBIAN_FRONTEND=noninteractive apt-get install terraform
terraform -help

# docker
sudo DEBIAN_FRONTEND=noninteractive apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo DEBIAN_FRONTEND=noninteractive apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo docker run hello-world

# git-lfs
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo DEBIAN_FRONTEND=noninteractive apt-get install git-lfs=3.4.0

# fnm
curl -fsSL https://fnm.vercel.app/install | bash

# deno
curl -fsSL https://deno.land/install.sh | sh

cat << EOF >> ~/.bashrc

# deno
export DENO_INSTALL="$HOME/.deno"
export PATH=$DENO_INSTALL/bin:$PATH

EOF

source ~/.bashrc

# bun
curl -fsSL https://bun.sh/install | bash
# bun add -d @types/bun  

