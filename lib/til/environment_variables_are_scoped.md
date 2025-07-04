---
href: "/til/environment_variables_are_scoped"
title: Environment variables are scoped
excerpt: Environment variables are scoped. Variables from .env file are only accessible
  locally.
date: 04/07/2025
tags:
- Environment
- Variables
- Scope
- Local shell
- Export
published: true
updated: 04/07/2025
topics: kamal
---

# Environment variables are scoped

Environment variables are not added to the global environment, after sourcing a `.env` (`source .env`) file you would expect those variables to show up when running `printenv`
or at least I did, however these do add them to the local shell but when running a command like `kamal secrets print` this is a seperate process that doesn't have access to the current shell variables.
the solution is to add export in front of each `KEY=VAL` pair, this will make the variables available to the child process.

This will also mean they will show up when running `printenv` and therefore in kamal if your `.kamal/secrets` are `SECRET=$SECRET` then it will evaluate correctly