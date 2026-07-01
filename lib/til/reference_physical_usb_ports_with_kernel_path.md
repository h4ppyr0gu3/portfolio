---
href: '/til/reference_physical_usb_ports_with_kernel_path'
title: reference physical usb ports with kernel path
excerpt: ''
date: 24/02/2026
tags: 
published: true
updated: 24/02/2026
topics: ''
---

# reference physical usb ports with kernel path

I am working with usb ports that need to be mapped to a specific symlink that i can access reliably, to do this we use udev rules

udev is just userspace device manager which we will need to use to map the kernel values to the userspace values we require where we are working

we can find the physical usb path by running the following command 

```bash
udevadm info -a -p "$(udevadm info -q path -n /dev/video0)"
```

which then results in the following response

```
Udevadm info starts with the device specified by the devpath and then
walks up the chain of parent devices. It prints for every device
found, all possible attributes in the udev rules key format.
A rule to match, can be composed by the attributes of the device
and the attributes from one single parent device.

  looking at device '/devices/pci0000:00/0000:00:08.1/0000:65:00.3/usb1/1-2/1-2.4/1-2.4:1.0>
    KERNEL=="video0"
    SUBSYSTEM=="video4linux"
    DRIVER==""
    ...

  looking at parent device '/devices/pci0000:00/0000:00:08.1/0000:65:00.3/usb1/1-2/1-2.4/1->
    KERNELS=="1-2.4:1.0"
    SUBSYSTEMS=="usb"
    DRIVERS=="uvcvideo"
    ...

  looking at parent device '/devices/pci0000:00/0000:00:08.1/0000:65:00.3/usb1/1-2/1-2.4':
    KERNELS=="1-2.4"
    SUBSYSTEMS=="usb"
    DRIVERS=="usb"
    ...
```

We can then map this to a udev rule so that anything in this specific usb port with kernel address `1-2.4` has a symlink to `/dev/cam_one`, this means that no matter what order this computer turns on in, if i have this usb camera in here, it will always be known as `cam_one` which will point to the correct `/dev/videoX` path

to set the rules we create a new `.rules` file such as `/etc/udev/rules.d/90-camera.rules` with the following content: 

```
SUBSYSTEM=="video4linux", KERNELS=="1-2.4", ATTR{index}=="0", SYMLINK+="cam_one"
```

to reload and apply the rules we run the following commands

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```
