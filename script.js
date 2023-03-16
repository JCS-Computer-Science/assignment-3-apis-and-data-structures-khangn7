const BLOB_URL = "https://jsonblob.com/api/jsonBlob/1085945016400232448";

async function get_jsonBlob(){

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


async function update_jsonBlob(content_obj){

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


const username_box = document.getElementById("username-box");

const start_button = document.getElementById("start-button");
start_button.addEventListener("click", get_id);


async function get_id(){

    let json_blob = await get_jsonBlob();

    const user_id = Object.keys(json_blob);

    const user_name = username_box.value;

    json_blob[user_id] = {

        "username": user_name,
       
    }

    up

}

const form = document.getElementById("message-form");

form.onsubmit = (user_text)=> {
    user_text.preventDefault
    
    let user_obj = {

    }
}