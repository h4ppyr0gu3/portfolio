---
href: "/til/jump_tables_used_in_embedded_systems"
title: jump tables used in embedded systems
excerpt: Jump tables in embedded systems use arrays of function calls to execute specific
  functions based on a defined byte/integer
date: 23/05/2025
tags:
- jump tables
- embedded systems
- function calls
- arrays
- CPU
published: true
updated: 23/05/2025
topics: embedded
---

# jump tables used in embedded systems

A jump table is an array of function calls, it is essentially a map, if there is a specific byte/integer that defines type, then we can read that type/number and then call a corresponding function, it is an array of functions that when referenced execute a function on the types behalf

i.e.
```ruby
def jump_table
    [
        method1,
        method2,
        method3
    ]
end

jump_table[0x00]
# in this instance 0x00 is the type/number we are looking for
```

This is used instead of a switch statement, because it is more compact

The reason it is called a jump table is because the CPU would jump to that function