
# Deploying Cloud Apps

## Github-Centric 

As of Nov-2025, Cloud is tightly bound to a Github deployment strategy;

- Develop your code 
- Commit 
- Push to Github origin 
- This triggers Webflow's build process 


- Create a separate Git branch for your testing code 
    - This can be

## Build Process 

Webflow's build process is; 

1. 


### Triggering Builds 

- Automatic by pushing a commit to the Github repo & branch that the Webflow app is connected to 
- Manual, within the Dashboard, you can;
    - Deploy the latest commit by clicking the blue button
    - Deploy specific commits by clicking the link next to the commit 


### Important Logging Limitations 

Webflow currently logs;

- The build process
- Runtime errors. 

It does not log deployment errors, so there is no way to see what went wrong. 

> The most common cause of deployment errors seems to be D1 drizzle deployment scripts. 

