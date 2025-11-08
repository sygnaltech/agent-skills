
# Environment Details 

In Webflow Cloud, the environment consists of;

- A Github repo & branch binding
    - Build processes trigger anytime a new commit is made 
- A specific, current build 
    - The build history 
- Environment variables & secrets 
- Storage, including D1, KV, and R2 

> If you delete the enviroment, you will fully lose your data. 



## Environment Vars 

- Server-side vars are not accessible to client-side code 
- Client-side vars are accessible to both client-side and server-side code 
- However, client-side secrets may not be available initially during app start 

