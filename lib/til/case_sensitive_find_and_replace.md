---
href: "/til/case_sensitive_find_and_replace"
title: Case sensitive Find and Replace
excerpt: Vim find and replace is done with %s. The trailing /g is global so if there
  are 2 instances on a single line it will replace both. The trailing /I is case insensitive.
  The trailing /c is to choose. This will match all occurrences of Old with New. %s/Old/New/gI
date: 14/10/2025
tags:
- Vim
- find and replace
- case sensitive
- global
- case insensitive
published: true
updated: 14/10/2025
topics: vim
---

# Case sensitive Find and Replace

vim find and replace is doen with `%s`

the trailing `/g` is global so if there are 2 instances on a single line it will replace both

the trailing `/I` is case insensitive

the trailing `/c` is to coose

this will match all occurences of `Old` with `New`
`%s/Old/New/gI`

this will match all occurrences of `old`, `Old`, `OLD` with `new`
`%s/old/new/g`

this will match all occurrences of `old`, `Old`, `OLD` with `new` and then let you choose which ones to replace
`%s/old/new/gc`