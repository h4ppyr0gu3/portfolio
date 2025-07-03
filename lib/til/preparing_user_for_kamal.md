---
href: "/til/preparing_user_for_kamal"
title: Preparing user for kamal
excerpt: Preparing deployer user for kamal with docker installation
date: 03/07/2025
tags:
- Kamal
- Deployment
- User Management
- SSH Keys
- Sudoers
- Docker
published: true
updated: 03/07/2025
topics: kamal
---

# Preparing user for kamal

when using kamal it is a good idea not to use the root user

```bash
# copy the root ssh keys you want to use
ssh-copy-id -i ~/.ssh/deployer_key.pub root@xx.xx.xx.xx

# create deployer user
useradd --create-home deployer
usermod -s /bin/bash deployer

# copy root ssh keys
su - deployer -c 'mkdir -p ~/.ssh'
su - deployer -c 'touch ~/.ssh/authorized_keys'
cat /root/.ssh/authorized_keys >> /home/deployer/.ssh/authorized_keys
chmod 700 /home/deployer/.ssh
chmod 600 /home/deployer/.ssh/authorized_keys

# add user to sudoers file
echo 'deployer ALL=(ALL:ALL) NOPASSWD: ALL' | tee /etc/sudoers.d/deployer
chmod 0440 /etc/sudoers.d/deployer
visudo -c -f /etc/sudoers.d/deployer

# install docker
sudo apt update
sudo apt install apt-transport-https curl
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# add user to docker group
usermod -aG docker deployer
```
this prepares the `deployer` user for use with kamal