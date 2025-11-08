
# Building a Testing Environment for Cloud Apps



## Code Management 

- Create a separate development branch in your repo 
    - Do all of your new development here 
    - Perform all of your testing work here 

## Testing Setup 

- Clone your main Webflow site as TEST and configure a second cloud app environment on the TEST site 
- Connect it to your TEST branch 
- Configure it with TEST environment variables 


## Testing Process 

- Do your development on your TEST branch 
- Update any environment variable for TEST 
- Commit and push to origin 
- Wait 2 - 5 mins for the build 
- Check the build process in the dashboard to ensure it succeeded 
    - This is part of testing, to ensure your deployment scripts (e.g. Drizzle D1) are working 
- Test your application 

