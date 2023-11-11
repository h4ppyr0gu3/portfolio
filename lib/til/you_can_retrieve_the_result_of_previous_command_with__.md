---
href: "/til/you_can_retrieve_the_result_of_previous_command_with__"
title: You can retrieve the result of previous command with _
excerpt: Retrieve the result of previous command with _
date: 11/11/2023
tags:
- ruby
- IRB
- sessions
- previous command
- variable
published: true
updated: 11/11/2023
topics: Ruby
---

# You can retrieve the result of previous command with _

In Ruby IRB sessions, you can retrieve the result of previous command with `__`.

Here is an example: 
```ruby
irb(main):001> {test: "testing"}
=> {:test=>"testing"}
irb(main):002> test_hash = _
=> {:test=>"testing"}
irb(main):003> test_hash
=> {:test=>"testing"}
irb(main):004>
```

As you can see, if you forget to equate the previous result to a variable, you will still be able to retrieve it as opposed to rerunning an expensive command