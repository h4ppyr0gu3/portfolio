---
href: "/til/bundle_add"
title: Bundle add
excerpt: Use bundle add to install gems and write their version number to the Gemfile
  during installation.
date: 24/11/2023
tags:
- gems
- gemfile
- bundle add
- installation process
published: true
updated: 25/11/2023
topics: Ruby
---

# Bundle add

When adding gems to a gemfile for a private project we will often just type the gem name and then bundle install, this is not the best way,
use bundle add

```ruby
# Gemfile
source "https://rubygems.org"

gem "sinatra"
```

```sh
bundle install
```

bundle add `<gem_name>` will install the gem as well as write the version number to the Gemfile this can save time locking gem versions manually by doing it during the installation process

```ruby
# Gemfile
source "https://rubygems.org"

gem "sinatra", "~> 3.1"
```