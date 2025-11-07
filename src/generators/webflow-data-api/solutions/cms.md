

# CMS Items 

- Empty string fields are treated as NULLs  

## Unexpected Behaviors 

### Item GET may not return the full structure 

The CMS Item PATCH endpoint appears to remove all null fields from the CMS Item data structure, such that a subsequent GET will not see those empty fields. 

Be aware of this, in case you need to normalize the data to a structure, or check the CMS schema endpoints to determine the actual structure. 

