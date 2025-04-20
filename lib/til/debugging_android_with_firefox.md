---
href: "/til/debugging_android_with_firefox"
title: debugging android with firefox
excerpt: Debug Android Firefox with Firefox Developer Tools using ADB and about:debugging
date: 20/04/2025
tags:
- debugging
- Android
- Firefox
- developer tools
- ADB
published: true
updated: 20/04/2025
topics: firefox
---

# debugging android with firefox

you can debug android firefox using firefox developer tools

`about:debugging` allows you to connect to the android device to debug it

set up `adb` android debug bridge using `adb start-server`
list devices using `adb devices`

open `about:debugging` in firefox
enable debugging in Firfox for Android `Settings -> Advanced -> Remote debugging via USB`

connect to the device using `adb connect <device-id>`

your device should show up in the `about:debugging` page
connect to it and get to work