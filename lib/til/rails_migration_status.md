---
href: '/til/rails_migration_status'
title: Rails Migration Status
excerpt: ''
date: 12/07/2023
tags: 
published: false
updated: 12/07/2023
---

# Rails Migration Status

To get rails migration status use the following command:
```bash
rails db:migrate:status
```

this prints a list of all the migrations with either up or down next to it which is really helpful for rolling back or maintaining consistent state among multiple databases
