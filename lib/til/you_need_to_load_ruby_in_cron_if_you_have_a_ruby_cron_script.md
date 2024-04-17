---
href: "/til/you_need_to_load_ruby_in_cron_if_you_have_a_ruby_cron_script"
title: You need to load ruby in cron if you have a ruby cron script
excerpt: Load ruby in cron with version manager sourced or full path used before script
  execution
date: 12/03/2024
tags:
- ruby
- crontab
- script
- version manager
- shebang
published: true
updated: 17/04/2024
topics: Cron
---

# You need to load ruby in cron if you have a ruby cron script

When running a ruby crontab script, your chosen ruby version manager should be sourced before running the script, or at the very least, the complete ruby executable path should be used before calling the ruby script, even if that ruby script starts with the correct shebang `#!/usr/bin/env ruby`