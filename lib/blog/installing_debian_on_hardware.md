---
href: "/blog/installing_debian_on_hardware"
title: About this site
excerpt: Install Debian on hardware by downloading desired version, checking SHA256
  checksum, making ISO bootable with USB stick using `dd` command
date: 03/04/2024
tags:
- Debian
- installation
- hardware
- ISO
- bootable
- USB
- checksum
- SHA256
- dd
published: false
updated: 17/04/2024
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