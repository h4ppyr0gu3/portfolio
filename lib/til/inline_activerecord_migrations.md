---
href: "/til/inline_activerecord_migrations"
title: Inline ActiveRecord Migrations
excerpt: ActiveRecord migrations can be executed directly from the Rails console.
date: 02/02/2024
tags:
- ActiveRecord
- migrations
- Sinatra
- metadata
- ruby
published: true
updated: 17/04/2024
topics: Ruby
---

# Inline ActiveRecord Migrations

Credit to Florin Lipan in his post about [one ruby file to rule them all](https://lipanski.com/posts/one-ruby-file-to-rule-them-all)

You can manually create inline active record migrations, this was quite a shock to me at first because I didn't understand the inner workings of it, but afterwards it makes a lot more sense

## What can it be used for?

If you have essential migrations that need to be run on server startup that hold metadata, this doesn't seem very useful in the case of rails, but when using sinatra, it may come in handy.

```ruby
class CreateRandomMigration < ActiveRecord::Migration[7.1]
  def self.version
    1
  end

  def change
    create_table :randoms do |t|
      t.string :name
    end
  end
end

class AlterRandomMigration < ActiveRecord::Migration[7.1]
  def self.version
    2
  end

  def change
    add_column :randoms, :created_at, :datetime
  end
end

# Perform migrations
migrations = [CreateRandomMigration, AlterRandomMigration]
ActiveRecord::Migrator.new(:up, migrations).migrate
```

## How it works

The version is used as a unique identifier for the migration, in the case of rails, it is the timestamp of the migration.
It can use the class itself, but it is an essential definition required on the migrations themselves.
It allows you to independently run/rerun migrations from the command line listing them out by running `rake db:migrate:status`

You can independently run migrations from the command line with `rake db:migrate VERSION=2`