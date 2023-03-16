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

    console.log(data)
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

    console.log(data); 
}

//update_jsonBlob();

//get_jsonBlob();

