---
href: "/blog/installing_debian_on_hardware"
title: About this site
excerpt: Install Debian on hardware by downloading desired version, checking SHA256
  checksum, making ISO bootable with USB stick using `dd` command
date: 03/04/2024
tags:
- Debian
- installation
- bootable
- USB
- sudo group
- system setup
- formatting
published: true
updated: 18/04/2024
topics: Linux
---

# Installing Debian on Hardware

## Pre-requisites
- USB stick
- Computer to write to
- Internet/Ethernet connection

## Download the desired version of Debian

Download the desired version of Debian from [here](https://www.debian.org/).
**N.B.** Compare the SHA256 checksum to ensure that it is untampered with using the following command
```shell
sha256sum <path to downloaded iso file>
```

## Make the ISO bootable

Install the ISO file on a USB stick, then use the following command to make it bootable
There are a couple of things to be aware of, first you will have to clear the USB stick and then copy the ISO image to it using `dd`
**N.B.** make sure to use the correct path otherwise you could end up overwriting your own system

first make sure you can see the device on your computer using
```shell
lsblk -p | grep disk
```
resize the partitions so that there is only one partition correctly formatted
```shell
sudo cfdisk /dev/sdX
```
Unmount the USB stick
```shell
sudo umount /dev/sdX
```
copy the ISO image to the USB stick
```shell
sudo dd if=$HOME/<path-to-iso-file> of=/dev/sdX bs=4M conv=fdatasync status=progress
```

## Booting from the USB stick

If a bootable disk is already present, you may have to open your bios settings and enable the boot from USB option, or change the order of booting from which devices

Bios settings can normally be opened by pressing `F12`, `F2` or `ESC` key repeatedly on start up

Go through the graphical setup to get your computer ready to boot from USB

## Add user to sudo group

run the following command to allow the user to use sudo 
**N.B.** you have to run this command as the root user
```shell
usermod -aG sudo <username>
```
exit as root and login as your user again

## Setup and configure your system as you'd like

My recommendation for a decent base installation: 
```shell
sudo apt install git curl ssh neovim build-essential ufw
sudo systemctl start ssh
sudo systemctl start ufw
sudo ufw allow 22/tcp # sudo ufw allow from 192.168.1.100 to any port 22
sudo systemctl enable ssh
sudo systemctl enable ufw
```

## Format the USB stick

After you are finished with the USB stick, format it using the following command

```shell
sudo umount /dev/sdX
sudo mkfs.ext4 /dev/sdX
```