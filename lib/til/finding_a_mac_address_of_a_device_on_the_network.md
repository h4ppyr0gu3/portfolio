---
href: "/til/finding_a_mac_address_of_a_device_on_the_network"
title: Finding a MAC address of a device on the network
excerpt: Discover MAC address using ARP scan
date: 17/09/2025
tags:
- MAC address
- networking
- ARP scan
- nmap
- DNS server
published: true
updated: 17/09/2025
topics: networking
---

# Finding a MAC address of a device on the network

You need to do an ARP scan which means Address Resolution Protocol, which is a layer below IP addresses on the OSI model

you can do this by using nmap or pinging the device

```bash
sudo nmap -PR -sn 192.168.1.0/24
```

or for when there is no DHCP or DNS server in the loop:

```bash
ping -c 1 192.168.1.64

ip neighbor show
```