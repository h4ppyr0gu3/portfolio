---
href: "/blog/framework_arch_setup_for_battery"
title: FrameWork Arch Setup for Battery
excerpt: Setup FrameWork laptop the write way so that it has great battery life on
  arch
date: 19/04/2025
tags:
- Linux
- Arch
- Battery Life
- SwayWM
- Framework Laptop
published: true
updated: 20/04/2025
topics: ''
---

# FrameWork Arch Setup for Battery

The framework laptop has exceeded my expectations in terms of build quality, I expected a lot more tacky setup but it turns out that it has great build quality and a lot of tools around it to make it as seemless as possible, there are obviously a lot of challenges that come with using Arch on it, and that is most of the problem but I would have it no other way

For additional details always refer to the [wiki](https://wiki.archlinux.org/title/Framework_Laptop_13)

## Setup

This is built on the back of my dotfiles which can be found [here](https://github.com/h4ppyr0gu3/dotfiles)
I am running SwayWM

configurations have to be changed for a few things

Requirements: 

- [TLP](https://wiki.archlinux.org/title/TLP) - pretty much used as plug and play
- [ectool](https://aur.archlinux.org/packages/fw-ectool-git) - used to get battery info
- [batenergy.sh](https://github.com/equaeghe/batenergy) - adds some debug logs

#### Batenergy
Install batenergy by copying the batenergy.sh script to `/lib/systemd/system-sleep/batenergy.sh`
(**N.B.** Make sure it is executable)\
this is essentially hooks that are run on sleeping / hibernating
Make sure to test it manually, i had to change `BAT0` to `BAT1` on my laptop

#### Ectool
using `yay` to install `ectool` is simple and straigt forward,
to use the AC power only use `sudo ectool chargecontrol idle`
to set max and min charge levels use `sudo ectool chargecontrol normal <min> <max>`

#### TLP

tlp is pretty straight forward and available in pacman repos
it is started in my sway config with `exec tlp start`
I think it can also be enabled on the machine to start on startup with `sudo systmctl enable tlp`

## Hibernate
I am trying to make it hibernate in all cases so that it doesn't end up using battery whilst sleeping
to enable hibernate, swap memory is required, to create swap memory after provisioning the system refer to [wiki](https://wiki.archlinux.org/title/Swap):
```bash
mkswap -U clear --size 30G --file /swapfile # technically should be 2 - 3x the size of RAM

swapon /swapfile
```

to enable on startup it needs to be added to `/etc/fstab`

```bash
# /etc/fstab

/swapfile none swap defaults 0 0
```

to reliably read the hiberantion state to and from the system it needs to be set in `/sys/power/resume_offset`
which i gather is the physical offset on the disk of the swap space
more info can be found [here](https://wiki.archlinux.org/title/Power_management/Suspend_and_hibernate)

```bash
filefrag -v /swapfile
# this returns a lot of info about the disk

# Filesystem type is: ef53
# File size of /swapfile is 32212254720 (7864320 blocks of 4096 bytes)
# ext:     logical_offset:        physical_offset: length:   expected: flags:
#   0:        0..       0:   12003328..  12003328:      1:
#   1:        1..    6143:   12003329..  12009471:   6143:             unwritten
#   2:     6144..   14335:   12017664..  12025855:   8192:   12009472: unwritten
# ...
# ...
```

the physical offset is: `12003328`, this needs to be put into the file `/sys/power/resume_offset`

`echo 12003328 > /sys/power/resume_offset`

There is a lot of options that can be set in `/etc/systemd/sleep.conf`

A few more things need to be done to ensure that it works as expected

##### configure mkinitcpio

need to add a hook for resume to `/etc/mkinitcpio.conf`

```bash
# /etc/mkinitcpio.conf

HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)
# becomes 
HOOKS=(base udev resume autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)
# the change is adding resume between udev and autodetect
```

after changing this file the following command needs to be run

```bash
sudo mkinitcpio -p linux
```

##### configure boot loader entries

the file name may differ but should be in `/boot/loader/entries/*_linux.conf`
mine is `/boot/loader/entries/2025-03-24_13-51-24_linux.conf`
this is for `systemd-boot` not `GRUB`
to find UUID you can use `blkid` which will print the UUID of swap partition if provisioned or just the root partition that you used when provisioning the swap file in `/swapfile`

the `resume_offset` is what we found earlier

```bash
# /boot/loader/entries/2025-03-24_13-51-24_linux.conf

# Created by: archinstall
# Created on: 2025-03-24_13-51-24
title   Arch Linux (linux)
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=PARTUUID=1fdad501-e0a3-4016-8df6-c85ea09427a7 rw rootfstype=ext4
# becomes
options root=PARTUUID=1fdad501-e0a3-4016-8df6-c85ea09427a7 rw rootfstype=ext4 resume=UUID=cc2161cd-8c82-411c-8435-670e3dc7a772 resume_offset=11874304
# adding resume=UUID=cc2161cd-8c82-411c-8435-670e3dc7a772 resume_offset=11874304
```

##### configure logind.conf

we need to change some options in `/etc/systemd/logind.conf`, this will handle which states to use for lid switch and how to handle power buttons

```bash
# /etc/systemd/logind.conf

[Login]

# these are so that when pressing the power button i show a menu in sway instead of shutting down
HandlePowerKey=ignore
HandlePowerKeyLongPress=poweroff
HandleRebootKey=ignore
HandleRebootKeyLongPress=poweroff
HandleSuspendKey=ignore
HandleSuspendKeyLongPress=poweroff
# this handles hibernation on lid close, there is a lot of options which you can choose how to handle in the file
HandleLidSwitch=hibernate
HandleLidSwitchExternalPower=hibernate
```