module.exports = {
    "config": {
        "apiKey": "2061acef-0451-4545-f754-60cf8160",
        "organization_Id": "5ff747727005da1c272740ab",
        "host": "general.cocreate.app"
    },
    
    "sources": [{
            "entry": "./docs/index.html",
            "collection": "files",
            "document_id": "6019bade4eea0817df303b0a",
            "key": "src",
            "data":{
                "name": "index.html",
                "path": "/docs/calculation/index.html",
                "domains": [
                    "general.cocreate.app"
                ],
                "directory": "/docs/calculation",
                "content-type": "text/html",
                "public": "true",
                "website_id": "61381ed8829b690010a4f2b2"
            }
        }
    ],

	"extract": {
		"directory": "./src/",
		"extensions": [
			"js",
			"css",
			"html"
		],
		"ignores": [
			"node_modules",
			"vendor",
			"bower_components",
			"archive"
		]
	}
}

