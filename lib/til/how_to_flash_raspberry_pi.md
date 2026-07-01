---
href: '/til/how_to_flash_raspberry_pi'
title: how to flash raspberry pi
excerpt: ''
date: 01/02/2026
tags: 
published: true
updated: 01/02/2026
topics: ''
---

# how to flash raspberry pi

2️⃣ Decompress + flash in one pipe

Ubuntu images are .xz. We stream-decompress and write directly:

sudo apt install -y xz-utils pv

Now flash:

sudo sh -c 'xzcat /home/david/Downloads/ubuntu-24.04.3-preinstalled-server-arm64+raspi.img.xz | pv | dd of=/dev/sda bs=4M status=progress oflag=sync'

This does all of this:

    Decompresses

    Writes raw image

    Shows progress

    Forces disk flush

3️⃣ Finalize (critical)

sync

Wait for it to finish.
4️⃣ Eject

sudo eject /dev/sda

Now the SD card is ready to boot.
