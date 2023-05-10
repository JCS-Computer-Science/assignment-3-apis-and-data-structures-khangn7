# messaging website

# PLEASE READ - how to use

this website sends and displays text between two users using the JSONblob api

to test this you need to open this on two different tabs and do these steps.
1. sign-in in the first tab, wait for the message screen to be displayed
2. we need to wait for a PUT request response, just wait at least (probably) 5 seconds
3. you can then sign-in in your second tab
4. rate 5 stars on yelp

<br>

# ignore this 

1. default json
2. changing api-endpoint.js

<br>

## 1. default json
<br>

```
// blank user json blob 

{
    "taken": false
}


// init user json blob

{
    "taken": true,
    "messages": [],
    "username": (string) username
}


// message object pushed to user_json_blob[ "messages" ]

{
    "content": string
    "time": string
}
```

<br>

## 2. changing api-endpoints.js
<br>if the website directed you here, actually just retry first with both tabs open
1. go to https://jsonblob.com/
2. press 'new' button near search bar
3. paste 'blank user blob' from the 'default json' section above into code editor
3. press save and get the endpoint in 'http://jsonblob.com/< endpoint >'
4. do this twice
5. replace endpoints in api-endpoints.js
