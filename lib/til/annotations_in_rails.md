---
href: "/til/annotations_in_rails"
title: Annotations In Rails
excerpt: You can use bin/rails notes to get all occurrences of commented annotations.
date: 10/07/2023
tags:
- Rails annotations
- custom entries
- bin/rails notes
- TODO
- FIXME
published: false
updated: 10/07/2023
topics: Rails
---

# Annotations In Rails

Using `bin/rails notes` you can get all occurrences of commented annotations that are in the rails default list, but you are also able to extend this list with custom entries.

Some example keywords include: `TODO`, `FIXME`, etc.

And by using `bin/rails notes  --annotations <KEYWORD>` you can get all occurrences of that keyword

Here it is in the [docs](https://guides.rubyonrails.org/command_line.html#bin-rails-notes)