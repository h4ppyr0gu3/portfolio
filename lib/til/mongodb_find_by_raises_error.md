---
href: "/til/mongodb_find_by_raises_error"
title: MongoDB find_by raises error
excerpt: MongoDB `find_by` raises error
date: 05/09/2023
tags:
- MongoDB
- find_by
- raises error
- Mongoid::Errors::DocumentNotFound
- postgres
- additional error handling
published: true
updated: 05/09/2023
topics: Rails
---

# MongoDB `find_by` raises error

when using `Record.find_by(...)` with rails it raises `Mongoid::Errors::DocumentNotFound`

where as with postgres using `Record.find_by(...)` would just return `nil`, this means that additional error handling has to be used when using Mongo