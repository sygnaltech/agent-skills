
Make these changes

# Commands 

## `agent-skills add` 

- Will replace/alias `learn`, performing the same function 
- Config file addition 
    - Will create a `.agent-skills` if needed 
    - Will record the module being added, e.g. `cloudflare-workers` as well as the current date, and the version of agent-skills at the time of the skill installation 
        - Will update the existing record if it already exists 

## `agent-skills list` 

- Will put a * next to any skills already learned, based on the `.agent-skills` config file 

## `agent-skills update` 

- Will re-install all of the skills in `.agent-skills` 

## `agent-skills remove` 

- Will remove the associated folder 
- Will remove the skill from `.agent-skills` 




