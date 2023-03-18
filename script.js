const API_URL = "https://jsonblob.com/api/jsonBlob/";

const USERS = [
    {
        "endpoint": "1085945016400232448"
    },
    {
        "endpoint": "1086508883706658816"
    }
];


async function getJSONBlob(blob_endpoint){

    let response = await fetch(API_URL + blob_endpoint, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json"
        }
    });

    let data = await response.json();

    return data;
}


async function updateJSONBlob(blob_endpoint, content_obj){

    let response = await fetch(API_URL + blob_endpoint, {
        method: "PUT",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(content_obj)
    });

    let data = await response.json();

    return data; 
}





const username_box = document.getElementById("username-box");

const username_button = document.getElementById("username-button");
username_button.addEventListener("click", initUser);

const message_form = document.getElementById("send-form");

const messages_box = document.getElementById("messages-box");

const error_box = document.getElementById("error-message");




let my_user_name, 
    my_user_endpoint,
    my_message_count,

    other_user_endpoint,
    other_message_count;

async function initUser(){

    if(username_box.value.trim() === ""){

        error_box.innerHTML = "invalid username";
        return;
    }
    
    username_box.style.display = "none";
    username_button.style.display = "none";

    error_box.style.display = "block";
    error_box.innerHTML = "attempting to connect..."

    //get user blobs

    let chat_full = true;

    for(let i = 0; i < USERS.length; i++){

        let USERS_endpoint = USERS[i]["endpoint"];

        let USERS_blob = await getJSONBlob(USERS_endpoint);

        //if blob is not taken
        if(!USERS_blob["taken"]){

            my_user_endpoint = USERS_endpoint;

            my_user_name = username_box.value.trim();

            let _flip = i === 0 ? 1 : 0;

            other_user_endpoint = USERS[_flip]["endpoint"];


            //update this blob

            USERS_blob["taken"] = true;

            USERS_blob["messages"] = [];

            USERS_blob["username"] = my_user_name;
            
            await updateJSONBlob(USERS_endpoint, USERS_blob);

            chat_full = false;

            break;
        }
    }

    // if all json blobs are taken
    if(chat_full){

        error_box.innerHTML = "ppl are already using";
        return;
    }

    error_box.style.display = "none";
    
    messages_box.style.display = "block";
    message_form.style.display = "block";

    end_session_button.style.display = "block";

    // start routinely fetching json_blob to check for new messages, 
    // or if other user connected

    fetch_interval = setInterval(checkOtherUserBlob, 10000);

    other_message_count = 0;

    my_message_count = 0;

}

const end_session_button = document.getElementById("end-session");
end_session_button.addEventListener("click", endSession);

async function endSession(){

    await updateJSONBlob(my_user_endpoint, {
        "taken": false
    });

    //reset stage
}

function displayMessage(content_str, time_str){

    let paragraph = document.createElement("p");

    paragraph.class = "display-message";

    paragraph.innerHTML = time_str + '\n' + content_str;

    messages_box.appendChild(paragraph);

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

function messageSubmit(){
    
    if(!other_user_connected){

        console.log("no one listening")

        return;
    }

    console.log("sending msg");

    sendMessage(msg_input_box.value);

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

    } else {

        return;
    }


    // if other user messages have been updated
    let _other_messages_length = other_json["messages"].length;

    if(_other_messages_length !== other_message_count){

        let _other_messages = other_json["messages"];

        // add new messages

        for(let i = other_message_count; i < _other_messages_length; i++){

            let _message = _other_messages[i];

            displayMessage(_message["content"], _message["time"]);
        }

        other_message_count = _other_messages_length;
    }

}
