---
href: "/til/json_formatting_in_vim"
title: JSON formatting in vim
excerpt: Format JSON in vim using jq utility
date: 28/06/2023
tags:
- JSON
- vim
- formatting
- jq
- utility
published: true
updated: 28/06/2023
topics: Vim
---

# JSON formatting in vim

To format JSON in a file in vim you can use the following:
```vim
:%!jq .
```
`%` symbol refers to the content of the current file

and to format selected text in vim you can use the following:
```vim
:'<,'>!jq .
```
the `'<,'>` symbol refers to the selected text in visual mode

**N.B.** This requires `jq` utility to be installed