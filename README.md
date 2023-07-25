# h4ppyr0gu3 minimal blogging site

## How to run

```sh
git clone https://github.com/h4ppyr0gu3/portfolio
cd portfolio
npm install
# to run developer environment
npm run dev
# to create build
npm run build
```

## Requirements

- node version >= 16
- npm 
- git

## Usage

**N.B.** You may have to run `chmod +x <file>` to make it executable

### TIL
To create a TIL run `./i_learnt` followed by the \<title\> of the post
This will create an entry in lib/til/\<title\>.md

### Blog
**Not implemented Yet**
but will probably be `./write`

### Generate page

Run `./generate`, this will convert all markdown files from lib/\*\*/\* to `.astro` files in the pages directory, it also generates metadata with the help of OpenAI API

## Secrets

You will need to get API keys for each service, you can find the examples in `.env.example`

Run `cp .env.example .env` and then insert your own keys, These keys are required for the html generation from html

## Edge Cases

As the blog generates `.astro` files, it can have issues with curly brace charachters `{`, `}` and angle brackets `<`, `>`, to get around this you may have to add `is:raw` to a text block that incorporates them

