---
href: "/til/inline_bundling_with_ruby"
title: Inline Bundling with Ruby
excerpt: Ruby allows inline bundling, run time dependencies, impressive complex scripts
date: 24/06/2023
tags:
- Ruby
- script
- dependencies
- inline bundling
- run time
published: true
updated: 24/06/2023
topics: Ruby
---

# Inline Bundling with Ruby

Ruby provides an option to have a script that executes and requires dependencies inline and bundle it on runtime, This is pretty impressive and allows for very complex scripts to be written and only require dependencies on run time

```ruby
#! /usr/bin/env ruby
# frozen_string_literal: true

require 'bundler/inline'

gemfile true do
  source 'https://rubygems.org'

  gem 'debug', '~> 1.4'
end

# rest of code here
```

<!-- 'https://lipanski.com/posts/one-ruby-file-to-rule-them-all' -->
