---
href: "/til/til"
title: til
excerpt: Applying effects to HTML groups using Tailwind CSS grouping.
date: 23/06/2023
tags:
- Tailwind
- CSS
- grouping
- effects
- HTML
published: true
updated: 23/06/2023
---

# Tailwind grouping

When using grouping you can apply effects to groups
using the following HTML

```html
<div class="group p-5 m-5 rounded border">
  <button class="group-hover:bg-sky-400 rounded-lg p-2 m-2 border">test</button>
</div>
```

renders: 

```rawhtml
<div class="group p-5 m-5 rounded border">
  <button class="group-hover:bg-sky-400 rounded-lg p-2 m-2 border">test</button>
</div>
```
```rawhtml
<div class="group p-5 m-5 rounded border">
  <button class="group-hover:bg-sky-400 rounded-lg p-2 m-2 border">test</button>
</div>
```
