---
href: "/blog/about_this_site"
title: About this site
excerpt: This site uses Astro, Tailwind, Ruby and AI. Astro means I can try any JS
  framework. Tailwind is extensible and has great convenience features. Ruby is used
  for backend tasks. AI generates keywords for search.
date: 23/06/2023
tags:
- web development
- javascript
- frameworks
- AI
- Tailwind
published: true
updated: 25/07/2023
topics: ''
---

# About this site

## Design Choices
- [Astro](#Astro)
- [Tailwind](#Tailwind)
- [Ruby](#Ruby)
- [AI](#AI)

## Astro
[Astro](https://astro.build) means that I can try any javascript framework and have somewhere to put it, this is the key reason i decided to go with it

## Tailwind
[Tailwind](https://tailwindcss.com) Tailwind is very extensible and has great convenience features such as dark mode, it is also well supported by major frameworks and that means that no matter what framework I use, I will be able to get a consistent UI

## Ruby
[Ruby](https://rubygems.org) is my default language and so i had to use it somewhere, so to make it worth my while i write blogs in pure mark down and have scripts to create and alter the .astro files by adding all the metadata etc... I also want to have syntax highlighting without too much difficulty so using a ruby script I can use the gitlab API to convert markdown into HTML which i can compliment with custom CSS so that i get the look that I want.

## AI
AI is the new big thing and so using [ChatGPT](https://chat.openai.com) i can generate a short excerpt as well as a couple of key words which can help for a simple search that i have implemented with fuseJS on the frontend, which is using a json object as a database