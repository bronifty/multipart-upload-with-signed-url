#!/bin/bash

# Update the package index
sudo DEBIAN_FRONTEND=noninteractive DEBIAN_FRONTEND=noninteractive apt update -y

# Install required packages to allow apt to use a repository over HTTPS
sudo DEBIAN_FRONTEND=noninteractive DEBIAN_FRONTEND=noninteractive apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add the Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo DEBIAN_FRONTEND=noninteractive gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add the Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo DEBIAN_FRONTEND=noninteractive tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update the package index again
sudo DEBIAN_FRONTEND=noninteractive apt update -y

# Install Docker
sudo DEBIAN_FRONTEND=noninteractive apt install -y docker-ce docker-ce-cli containerd.io

# Verify Docker installation
sudo DEBIAN_FRONTEND=noninteractive docker run hello-world

# Add the current user to the docker group
sudo DEBIAN_FRONTEND=noninteractive usermod -aG docker $USER

# Log out and log back in to apply the group membership
su - ${USER}

# Verify that the current user is added to the docker group
groups

# Install Docker Compose
sudo DEBIAN_FRONTEND=noninteractive apt install -y docker-compose
