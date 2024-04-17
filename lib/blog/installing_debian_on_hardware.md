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
updated: 03/04/2024
topics: ''
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

```shell
```