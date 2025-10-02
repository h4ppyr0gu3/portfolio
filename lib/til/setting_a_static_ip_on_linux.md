---
href: "/til/setting_a_static_ip_on_linux"
title: Setting a static IP on linux
excerpt: Setting a static IP on linux by adding an address on the subnet. Flush IP
  address to revert to DHCP.
date: 17/09/2025
tags:
- Linux
- Static IP
- Ethernet
- Subnet
- DHCP
published: true
updated: 17/09/2025
topics: networking
---

# Setting a static IP on linux

Find your ethernet interface

```bash
ip addr show
```

Add the address on the subnet you would like, same as the device you are interacting with

```bash
sudo ip addr add 192.168.1.10/24 dev enp3s0
```

You can now access things such as IP cameras with fixed IP addresses that don't require DHCP

Afterwards, you may have to flush the IP address to revert to DHCP

```bash
sudo ip addr flush dev enp3s0
```