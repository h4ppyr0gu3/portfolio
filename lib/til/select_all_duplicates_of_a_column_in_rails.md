---
href: "/til/select_all_duplicates_of_a_column_in_rails"
title: Select all duplicates of a column in Rails
excerpt: Find duplicates of a column in Rails using group and having clauses
date: 11/07/2023
tags:
- Rails
- database
- duplicates
- group by
- having
published: false
updated: 28/07/2023
topics: Rails
---

# Select all duplicates of a column in Rails

Let's say we have a table `users` and we would like to find all places where `first_name` is the same:
we can always find all users where `user_name` is `h4ppyr0gu3` but what about all possible duplicates:

```ruby
User.select(min(id) as id, first_name).group(:first_name).having('count(*) > 1')
```
_or_
```ruby
User.where.not(first_name: nil).group(:first_name).having('count(*) > 1')
```

This returns an array of `User` objects with the `id` and `first_name` columns.
Now that we have all duplicated names we can map over them and get the ids:

```ruby
duplicated_user_names = 
    User.select(min(id) as id, first_name)
        .group(:first_name).having('count(*) > 1')
        .map(&:user_name)
```

and then using the previous query we can get the ids:

```ruby
duplicated_user_ids.each do |x|
    User.where(user_name: x).more_processing
end
```

We could just write the query as:
```ruby
User.group(:user_name).having('count(*) > 1')
```
but this raises PG::GroupingError

**Edit**

an improvement would be to use `array_agg` method to retrieve ids

```ruby
duplicated_user_ids = 
    User.group(:first_name)
        .having('count(id) > 1')
        .pluck('array_agg(id)')
```