import endpoints from "./api-endppoints.js";

console.log(endpoints);


const API_URL = "https://jsonblob.com/api/jsonBlob/";

const USERS = endpoints;


const error_box = document.getElementById("error-message");

const no_exist_message = "<br>jsonBlob does not exist, owner of github repo will need to create new endpoints and change 'api-endpoints.js' in repo, check README.md for steps<br><br> <b>this website will not work</b>"

async function getJSONBlob(blob_endpoint){

    let response;
    try
    {
        response = await fetch(API_URL + blob_endpoint, {
            method: "GET",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        throw response.status;
    }
    catch (status)
    {
        error_box.innerHTML = "reponse status " + response.status;
    }

    let data = await response.json();

    if (data.message !== undefined)
    {
        error_box.innerHTML += no_exist_message;
    }

    return data;
}

async function updateJSONBlob(blob_endpoint, content_obj){

    let response;

    try
    {
        response = await fetch(API_URL + blob_endpoint, {
            method: "PUT",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(content_obj)
        });
    }
    catch (error)
    {
        console.log(error);
    }

    let data = await response.json();

    return data; 
}

const username_box = document.getElementById("username-box");

const username_button = document.getElementById("username-button");
username_button.addEventListener("click", initUser);

const message_form = document.getElementById("send-form");

const messages_box = document.getElementById("messages-box");

const join_div = document.getElementById("join-box")

const messages_container = document.getElementById("messages-container");

const login_div = document.getElementById("login-div");


let my_user_name, 
    my_user_endpoint,
    my_message_count,

    other_user_name,
    other_user_endpoint,
    other_message_count;

async function initUser(){


    if(username_box.value.trim() === ""){

        error_box.innerHTML = "invalid username";
        return;
    }
    
    error_box.innerHTML = "please wait a moment...";


    // hideStartScreen();

    // hideMessageScreen(true);

    // return;


    // check user json_blobs and take the first available one


    let chosen_endpoint = await getAvailableEndpoint();

    if(chosen_endpoint === -1){

        error_box.innerHTML = "ppl are already using";
        return;

    } else {

        
        my_user_endpoint = USERS[chosen_endpoint]["endpoint"];


        my_user_name = username_box.value.trim();

        let _flip = chosen_endpoint === 0 ? 1 : 0;

        other_user_endpoint = USERS[_flip]["endpoint"];

        // update taken blob

        let take_blob = {
            "taken": true,
            "messages": [],
            "username": my_user_name
        };
            
        await updateJSONBlob(my_user_endpoint, take_blob);
    }

    checkOtherUserBlob();

    hideStartScreen();

    hideMessageScreen(true);

    error_box.innerHTML = "you will need to click end session before you close, "
    + "refresh <br> or leave the site. If you forgot to afterwards then tell me!!!";
    

    // start routinely fetching json_blob to check for new messages, 
    // or if other user connected

    fetch_interval = setInterval(checkOtherUserBlob, 10000);

    other_message_count = 0;

    my_message_count = 0;

}

async function getAvailableEndpoint(){

    // returns USERS index of first available endpoint: 0 or 1. -1 if all are taken

    for(let i = 0; i < USERS.length; i++){

        let USERS_blob = await getJSONBlob(USERS[i]["endpoint"]);

        if(!USERS_blob["taken"]){

            return i;

        }

    }

    return -1;

}



const end_session_button = document.getElementById("end-session");
end_session_button.addEventListener("click", endSession);

async function endSession(){

    await resetSession(my_user_endpoint);

    error_box.innerHTML = "exited successfully";

    setTimeout(()=>{
        error_box.innerHTML = "";
    }, 800);

    // stop interval fetching 

    clearInterval(fetch_interval);

    //reset stage

    hideStartScreen(true);

    hideMessageScreen();

}


const reset_button = document.getElementById("reset-button");
reset_button.addEventListener("click", ()=>{

    for(let i = 0; i < USERS.length; i++){

        resetSession(USERS[i]["endpoint"]);
    }
});

async function resetSession(endpoint){

    updateJSONBlob(endpoint, {
        "taken": false
    });
}

function displayMessage(content_str, time_str, align_right, username){

    let paragraph = document.createElement("p");

    paragraph.class = "display-message";

    if(align_right){
        paragraph.style.textAlign = "right";
    }

    paragraph.innerHTML = time_str + '<br>' + '<b>'+ username + '</b>' + '<br>' + content_str;

    messages_container.appendChild(paragraph);

    // scroll down to latest message
    let scroll_y = messages_container.children.length*paragraph.offsetHeight - messages_container.offsetHeight + 16;

    messages_container.scroll(0, scroll_y)
}


function getTimeStr(){

    let date = new Date();

    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}


const send_button = document.getElementById("send-button");

const msg_input_box = document.getElementById("message-input-box");

send_button.addEventListener("click", messageSubmit);

let other_user_connected = false;

let fetch_interval;

const process_message = document.getElementById("process-message");

async function messageSubmit(){

    if(msg_input_box.value.trim() === ""){
        
        return;
    }
    
    if(!other_user_connected){

        process_message.innerHTML = "no one is listening...";

        return;
    }

    sendMessage(msg_input_box.value);

    displayMessage(msg_input_box.value, getTimeStr(), true, my_user_name);

    process_message.innerHTML = "message sent";

    msg_input_box.value = "";

}

async function sendMessage(content_str){

    let my_blob = await getJSONBlob(my_user_endpoint);

    let _msg = {
        "content": content_str,
        "time": getTimeStr()
    }

    my_blob["messages"].push(_msg)

    await updateJSONBlob(my_user_endpoint, my_blob);

    return true;

}

async function checkOtherUserBlob(){

    let other_json = await getJSONBlob(other_user_endpoint);

    //if other user has connected
    if(other_json["taken"]){

        other_user_connected = true;

        other_user_name = other_json["username"];

    } else {

        other_user_connected = false;

        return;
    }


    // if other user messages have been updated
    let _other_messages_length = other_json["messages"].length;

    if(_other_messages_length !== other_message_count){

        let _other_messages = other_json["messages"];

        // add new messages

        for(let i = other_message_count; i < _other_messages_length; i++){

            let _message = _other_messages[i];

            displayMessage(_message["content"], _message["time"], false, other_user_name);
        }

        other_message_count = _other_messages_length;
    }

}



// UI FUNCTIONS


const dev_box = document.getElementById("dev-box");

const dev_button = document.getElementById("dev-button");

{

    let flip = true;

    dev_button.addEventListener("click", ()=>{

        if(flip){

            dev_box.style.display = "flex";
            flip = false;

        } else {

            dev_box.style.display = "none";
            flip = true;

        }

        
    })
}

const website_div = document.getElementById("website-div");

function setCSS(){

    msg_input_box.style.width = (500 - send_button.offsetWidth) + "px";

    dev_box.style.display = "none";

}

setCSS();

function hideStartScreen(show=false){
    // show = true/false
    
    if(show){

        login_div.style.display = "block";

        username_box.value = "";
        
    } else {

        login_div.style.display = "none";
    }
}

function hideMessageScreen(show=false){
    
    // clear message container
    while (messages_container.firstChild)
    {
        messages_container.removeChild(messages_container.firstChild);
    }

    process_message.innerHTML = "";

    msg_input_box.value = "";

    if(show){

        messages_box.style.display = "block";

        end_session_button.style.display = "block";

    } else {

        messages_box.style.display = "none";

        end_session_button.style.display = "none";
    }
}

// fill api-links
{
    for(let i = 0; i < USERS.length; i++){

        let api_link = document.createElement("a");

        api_link.className = "api-link";

        api_link.appendChild(document.createTextNode(USERS[i]["endpoint"]));
        api_link.href = "http://jsonblob.com/" + USERS[i]["endpoint"]; 

        dev_box.appendChild(api_link);
    }
}