---
href: "/til/log_activerecord_queries_to_stdout"
title: Log ActiveRecord Queries to STDOUT
excerpt: Set the ActiveRecord logger to log SQL queries to STDOUT.
date: 04/09/2023
tags:
- logging
- ActiveRecord
- console
- raw sql
- logger
published: true
updated: 04/09/2023
topics: Rails
---

# Log ActiveRecord Queries to STDOUT

run the following in your console to log the raw sql queries generated:  

`ActiveRecord::Base.logger = Logger.new(STDOUT)`