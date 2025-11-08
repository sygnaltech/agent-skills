
# Cloud and D1, R2, and KV 

## D1 (SQLlite) 


### Administration 

Through the dashboard the User can- 

- See D1 data 
- Add and delete records and edit fields in D1 

> In longer records, the edit button may be off-screen, so scroll the panel to see it. 


### Limitations 

Webflow does not currently support; 

- Direct access to your Webflow-cloud-hosted 
    - Including wrangler -remote access 
- External backups of your D1 data 
- The ability to directly view or manipulate the D1 schema 
- Querying D1 data 

### Tips 

For important production data,

- Build your own secure import/export API
    - Use JSON for easy processing and portability 
    - Use a private ADMIN_KEY secret for administrators 
- Build your own secure schema-rendering API 
    - Use this to examine the production schema when Drizzle deployment script errors are occurring 







