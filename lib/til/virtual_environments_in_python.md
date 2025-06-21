---
href: "/til/virtual_environments_in_python"
title: virtual environments in python
excerpt: Virtual environments in Python encapsulate project dependencies locally to
  avoid conflicts. Setup with venv package, activate with source myenv/bin/activate,
  install requirements, deactivate with deactivate.
date: 18/06/2025
tags:
- Python
- virtual environments
- dependencies
- venv
- setup
published: true
updated: 21/06/2025
topics: python
---

# virtual environments in python

In python there is the concept of virtual environments which encapsulates all the dependencies locally to that project so that you don't get dependency mismatch or using the wrong versions from another projects dependencies.

To setup virtual environments you first need to have the venv python package
Install it with the following: `pip install venv`

you can then create a virtual environment with the following: `python3 -m venv myenv`, however, this looks tacky when you run `ls` or are looking from the file browser, to fix this add a `.` so that it is a hidden folder

to activate the virtual environment run `source myenv/bin/activate`

once it is activated you will then have to install all the requirements with `pip install -r requirements.txt`

to deactivate the virtual environment run `deactivate`


### Complete venv setup
```bash
python3 -m venv .venv --prompt 'custom name of venv'
source .venv/bin/activate
pip install -r requirements.txt
```

possible aliases and functions for managing this

```bash
alias pysrc='source .venv/bin/activate'

function pysrc_create() {
    if [[ -n "$1" ]]; then
        python3 -m venv .venv --prompt "$1"
    else
        python3 -m venv .venv
    fi

    source .venv/bin/activate
}

# I like the colon delimiter in most of my other commands to namespace them
alias pysrc:create='pysrc_create'
```

Remember to add `.venv` to your `.gitignore` as well as `__pycache__`

### Deactivate the venv
```bash
deactivate
```