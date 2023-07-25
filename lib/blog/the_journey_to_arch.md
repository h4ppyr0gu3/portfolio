---
href: "/blog/the_journey_to_arch"
title: The Journey to Arch
excerpt: Started with Ubuntu, switched to Arch. Debian had dependency errors. Dual
  booting Arch and Debian caused boot loop. Finally settled on Arch.
date: 15/04/2022
tags:
- Ubuntu
- Arch
- Debian
- distro hopping
- dependency errors
published: true
updated: 25/07/2023
topics: ''
---

# The Journey to Arch

## In the beginning
As all Arch users began with Ubuntu I guess it is only fair that that is where I started as well. I started watching reviews on GNOME versions and soon came to realize the limitations of a stable distro: You don't get access to the cutting edge packages and features and so I simply had to change to Arch.

## In search of the bleeding edge
Nope it wasn't that simple, in fact I first changed to the 6 month release from Ubuntu which was not an LTS version in order to try out a few of the latest GNOME improvements, I then tried to install docker which is unsupported on any version of ubuntu that is not LTS which makes sense. So I thought to go to the root of the cause.

## Debian
Debian Bullseye Is the father of all these Ubuntu releases so it must have access to the latest packages right? Well not unless you change the apt repository to the unstable version where you can't not have a package, They must have everything there?
Dependency errors, that's it. You are left with a system of half stable and half unstable, trying to install some of the latest software compiling from github because there is no alternative repository hosting all this custom software except on github.

## First install
I had been flirting with the idea of moving to Arch as well, looking in the mirror and telling myself I am a hardcore Linux user. So.... I have the bright idea of dual booting Arch and Debian. I had installed Arch on a virtual machine so I thought I was ready but a slight lack of judgement and understanding on my part whilst installing Debian was that I chose to go with Logical Volume Management which I still don't know what it does so my Debian installation was in a boot loop after seeing that the size of the LVM and available size on the partitition were different.
Well S**t.

## No turning back now
As much as I told myself I was a hardcore Linux user it seemed an opportune time to live up to it so Arch it is - although it wasn't really a choice, it was now the only bootable ISO image I had on hand. I installed Arch 3 times that day, GRUB couldn't figure out where and to be honest neither could I.

## Sane at last
After successfully installing Arch I went about getting back all my settings which at this stage were no longer dependent on GNOME because as a hardcore Linux user it has to be a window manager, and so after pulling all my dotfiles and configuring everything again, finding some packages was such a breeze after learning the dirty secrets of the Arch User Repository and so rarely had to compile untested github code

## Conclusion
For some of us looking for the bleeding edge we all start with a user friendly distro but after changing so many times to try and get the latest and greatest software I guess the only constant is change and as Arch is always changing I hope that that will keep me away from distro hopping.  