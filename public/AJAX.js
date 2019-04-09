//var baseURL = "http://localhost:5000";
var baseURL = "https://vast-spire-48779.herokuapp.com";

function createEntry() {
    var input = document.getElementById('input').value;
    var goal_id = document.getElementById('goal_id').value;
    //var date = document.getElementById('date').value;

    var searchURL = baseURL + `/createEntry?id=${goal_id}&input=${input}`; //&date=${date}`;
    console.log(`createEntry => URL: ${searchURL}`);
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(`createEntry => returnVal: ${this.responseText}`);
            var obj = JSON.parse(this.responseText);
            
            var entries = document.getElementById("entries");

            // put it at the front
            entries.innerHTML = `<b>Timestamp:</b> ${obj.timestamp} <br/><br/>` + entries.innerHTML;
            entries.innerHTML = `<b>Input:</b> ${obj.input} <br/>` + entries.innerHTML;  
        }
    };
    xhttp.open("GET", searchURL, true);
    xhttp.send(); 
}

function createGoal() {
    var frequency = document.getElementById('frequency').value;
    var name = document.getElementById('name').value;
    var entry = document.getElementById('entry').value;

    if (name == "") {
        console.log("blank name field");
        return;
    }

    var searchURL = baseURL + `/createGoal?name=${name}&frequency=${frequency}`;
    searchURL += `&entry=${entry}`;
    console.log(`createGoal => URL: ${searchURL}`);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(`createGoal => returnVal: ${this.responseText}`);
            
            /*var obj = JSON.parse(this.responseText);
            
            var entries = document.getElementById("entries");
*/
            entries.innerHTML = `reload to see the new goal<br/><br/>` + entries.innerHTML;
            //entries.innerHTML = `<b>entry_type:</b> ${obj.type} <br/>` + entries.innerHTML;
            //entries.innerHTML = `<b>name:</b> ${obj.name} <br/>` + entries.innerHTML;
            
        }
    };
    xhttp.open("GET", searchURL, true);
    xhttp.send();
}

function createUser() {

    console.log(`entered function`);

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var pass1 = document.getElementById('pass1').value;
    var pass2 = document.getElementById('pass2').value;

    if (!validateText('name', 'nameError') 
            || !validateText('email', 'emailError') 
            || !validatePass('pass1', 'pass2', 'passError')) {
                console.log(`something wrong with data`);
                return false;  // those functions take care of the err messages
            }

    var searchURL = baseURL + `/createUser?name=${name}&email=${email}&pass=${pass1}`;
    console.log(`createUser => URL: ${searchURL}`);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(`createUser => returnVal: ${this.responseText}`);
            
            var obj = JSON.parse(this.responseText);
            var entries = document.getElementById("status");
            
            entries.innerHTML = `${obj.status}` + entries.innerHTML;            
        }
    };
    xhttp.open("GET", searchURL, true);
    xhttp.send();
    return false; // keeps page from refreshing
}

function deleteGoal(id) {
    alert(`goal ${id} cannot be deleted right now`);
}