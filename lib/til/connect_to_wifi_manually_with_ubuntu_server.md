---
href: '/til/connect_to_wifi_manually_with_ubuntu_server'
title: Connect to Wifi Manually with Ubuntu Server
excerpt: ''
date: 02/12/2025
tags: 
published: true
updated: 02/12/2025
topics: ''
---

# Connect to Wifi Manually with Ubuntu Server

Don't ask how you end up in this situation but out of interest this same principle will work accross other distros
I had an ubuntu server instance that was not connected to the wifi, I had access to the terminal,
To connect it to wifi without nmcli / NetworkManger you can do the following

```bash
wpa_passphrase "YOUR_WIFI_NAME" "YOUR_WIFI_PASSWORD" | sudo tee /etc/wpa_supplicant.conf
```

this creates the encrypted PSK (Pre-Shared Key) entry and saves it to automatically connect to that network
then to reload the client:

```bash
sudo wpa_supplicant -B -i your_wifi_iface -c /etc/wpa_supplicant.conf
sudo dhclient your_wifi_iface
```
where `your_wifi_iface` is `wlp3s0` or something similar
the `wpa_supplicant` command args are as follows:
- `-B` run in the background
- `-c` using the config file specified
- `-i` usint the interface specified

the `dhclient` command requests a DHCP lease so that you can actually recieve internet packets

To test the connection you can then use `ping`

for persistence, the wifi network can be added to netplan

`ls /etc/netplan`

`sudo nano /etc/netplan/01-netcfg.yaml`

```yaml
network:
  version: 2
  renderer: networkd
  wifis:
    wlp3s0:
      dhcp4: true
      access-points:
        "YOUR_WIFI_NAME":
          password: "YOUR_WIFI_PASSWORD"
```

`sudo netplan apply` to apply the configuration
