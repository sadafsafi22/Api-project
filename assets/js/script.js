const API_KEY = "4sUTVy2530cAkKgRlRo8ZYbLDXo";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultModel = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click",e => postForm(e));

function processOptions(form){
    
    let optArray = [];

    for(let entry of form.entries()){
        if(entry[0] === "options"){
            optArray.push(entry[1]);
        }
    }
        form.delete("options");
        form.append("options", optArray.join());
        return form;
    
}
async function postForm(e){

    const form = processOptions(new FormData(document.getElementById("checksform")));
    
    // for(let entry of form.entries()){
    //     console.log(entry);
    // }
    
    // for(let e of form.entries()){
    //     console.log(e)
    // }

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body:form,
                        })
    const data = await response.json();

    if(response.ok){
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data){
    let heading = `JSHint Results for ${data.file}`;

    if(data.total_errors === 0) {
        results  = `<div class="no_errors">No errors reported!<div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error  of data.error_list){
            results += `<div>At line <span class="line>${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;
    resultModel.show('slow');
}

async function getStatus(e){

    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if(response.ok){
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data){

   let heading = "API Key Status";
   let results = `<div>Your key is valid until</div>`;
        results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;
    resultModel.show('slow');
}





// const getStatus = e =>{
//     fetch(API_URL+"?api_key="+API_KEY)
//         .then(response => response.json())
//         .then(data => displayData(data))
//         .catch((e) => {
//             console.error("Console Error for Freach: ",e);
//         });
// }

// const displayData = data => {
//     document.getElementById("results-content").innerHTML = '<p>'+data['expiry']+'</p><p>'+data.status_code+'</p>';
//     resultModel.show();
// }


function displayException(data){

    let heading  = `An Exception Occurred`;
    
    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error Number:<strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</storng><div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;
    resultModel.show('slow');
}