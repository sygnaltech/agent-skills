
Always use Wrangler's `.jsonc` format when possible. 

- Supports commenting 
- Supprots added commas 

# Vars structure 

Workers can read full structures stored in the `vars` section of the `.jsonc` 

IMPORTANT: Do NOT stringify these or try to JSON parse them, they will already be in correct object form when stored in the environment. 

Standard key-values; 

```
	"vars": {
		"WEBFLOW_SITE_ID": "123",
		"WEBFLOW_SUPPLIER_COLLECTION_ID": "123",
		"WEBFLOW_LISTINGS_COLLECTION_ID": "123",
    }
```

JSON objects; 

```
	"vars": {
		"WEBFLOW_LISTING_FIELD_MAP": {
			"name": "name",
			"slug": "slug",
			"tipologia": "tipologia-2",
        }
    }
```


JSON Arrays including arrays of objects; 

```
	"vars": {
		"MY_ARRAY": [
            {
                "name": "name",
                "slug": "slug",
                "tipologia": "tipologia-2",
            }
        ]
    }
```

