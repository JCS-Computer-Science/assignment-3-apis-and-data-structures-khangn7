const BLOB_URL = "https://jsonblob.com/api/jsonBlob/1085945016400232448";

async function getJSONBlob(){

    let response = await fetch(BLOB_URL, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json"
        }
    });

    let data = await response.json();

    return data;
}


async function updateJSONBlob(content_obj){

    let response = await fetch(BLOB_URL, {
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

function endSession(){

    updateJSONBlob({
        "messages": [],
        "users": [],
        "new-message": false
    });
}


const username_box = document.getElementById("username-box");

const username_button = document.getElementById("username-button");
username_button.addEventListener("click", init_user);

const form = document.getElementById("send-form");

const messages_box = document.getElementById("messages-box");

const error_message = document.getElementById("error-message");


async function init_user(){

    if(username_box.value.trim() === ""){

        error_message.innerHTML = "invalid username";
        return;
    }
    
    username_box.style.display = "none";
    username_button.style.display = "none";


    let _json_blob = await getJSONBlob();

    //create user id, username,
    //then push username to "users": []  of jsonBlob

    const user_id = _json_blob["users"].length;

    const user_name = username_box.value.trim();

    _json_blob["users"].push(user_name);

    let _init_response = await updateJSONBlob(_json_blob);

    //show message log div and form
    form.style.display = "block";
    messages_box.style.display = "block"; 

}

function sendMessage(user_text){


}


// start routine fetching json_blob to check for new messages on first message
form.onsubmit = (user_text)=> {
    user_text.preventDefault
    
    let user_obj = {

    }
}