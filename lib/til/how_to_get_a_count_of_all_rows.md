---
href: "/til/how_to_get_a_count_of_all_rows"
title: How to get a count of all rows
excerpt: Find row count in Rails with Heroku
date: 29/10/2023
tags:
- Rails
- Heroku
- row count
- query
- memory usage
published: true
updated: 29/10/2023
topics: Rails
---

# How to get a count of all rows

In rails when using heroku plans you sometimes run into limits and to find out which is the real memory hog you can run the following query:
```ruby
ActiveRecord::Base.connection.tables.map { |t| {t=>  ActiveRecord::Base.connection.execute("select count(*) from #{t}")[0]} }
```