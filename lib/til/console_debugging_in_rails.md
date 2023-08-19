---
href: "/til/console_debugging_in_rails"
title: Console Debugging in Rails
excerpt: 'Console debugging in Rails: Finding methods and their implementation.'
date: 19/08/2023
tags:
- console debugging
- Rails
- method search
published: true
updated: 19/08/2023
topics: ''
---

# Console Debugging in Rails

if you don't know where a method is defined but you know the class you can type 

```ruby
ClassName.method(:method_name).source
# or 
ClassName.method(:method_name).source_location
# or
show_source("ClassName.method_name.as_a_string")
```

obviously substituting the class name and method name to make it make sense

# Finding Possible Methods

if you need to find a method that should start with or contain certain phrase:

```ruby
ClassName.methods.map(&:to_s).select { |x| x.include?("phrase") }.map { |x| puts x }
```

These 2 in conjunction means that you can find the location and implementation of all methods that you need to use
whether you know it exists or not, this will give you a smaller area to cover