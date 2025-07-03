---
href: "/til/system_wide_environment_variables_in_shells"
title: System wide environment variables in shells
excerpt: System wide environment variables in shells - /etc/environment is the solution
  for system wide variables
date: 03/07/2025
tags:
- system wide
- environment variables
- shells
- interactive
- non-interactive
published: true
updated: 03/07/2025
topics: shell
---

# System wide environment variables in shells

Not all shells are created equal, there are interactive and non-interactive, login and non-login, the issue is when you want to create system wide variables, where do you put them so that all shells have them so i can access them using a deployment tool like [kamal](https://kamal-deploy.org), well the solution is that they should go into `/etc/environment`
there are limitations to this file though, it doesn't support any shell scripting, just simply key values, nothing with a `$`

Hope this helps