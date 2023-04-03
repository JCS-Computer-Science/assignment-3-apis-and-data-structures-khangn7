# api assignment

## PLEASE READ - how to use

this website sends and displays text between two users using the JSONblob api

to test this you need to open this on two different tabs and do these steps.
1. sign-in in the first tab, wait for the message screen to be displayed
2. we need to wait for a PUT request response, just wait at least (probably) 5 seconds
3. you can then sign-in in your second tab

<br>

## ignore this 

blank user json blob 

{
    "taken": false
}


init user json blob

{
    "taken": true,
    "messages": [ ],
    "username": < username >
}


message object pushed to user_json_blob[ "messages" ]

{
    "content":
    "time":
}
