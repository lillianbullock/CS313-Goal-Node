//var baseURL = "http://localhost:5000";
var baseURL = "https://vast-spire-48779.herokuapp.com";

function createEntry() {
    var input = document.getElementById('input').value;
    var goal_id = document.getElementById('goal_id').value;
    //var date = document.getElementById('date').value;

    var searchURL = baseURL + `/createEntry?id=${goal_id}&input=${input}&date=${date}`;
    console.log(`createEntry => URL: ${searchURL}`);
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(`createEntry => returnVal: ${this.responseText}`);
            var obj = JSON.parse(this.responseText);
            
            var entries = document.getElementById("entries");

            entries.innerHTML += `Input: ${obj.input} \n`;
            entries.innerHTML += `Timestamp: ${obj.timestamp} \n\n`;
        }
    };
    xhttp.open("GET", searchURL, true);
    xhttp.send();
  
}

function createGoal() {
    var frequency = document.getElementById('frequency').value;
    var name = document.getElementById('name').value;
    var entry = 4; //document.getElementById('date').value;

    var searchURL = baseURL + `/createGoal?name=${name}&frequency=${frequency}&entry=${entry}`;
    console.log(`createGoal => URL: ${searchURL}`);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(`createEntry => returnVal: ${this.responseText}`);
            //var obj = JSON.parse(this.responseText);
            
            //var entries = document.getElementById("entries");

            //entries.innerHTML += `Input: ${obj.input} \n`;
            //entries.innerHTML += `Timestamp: ${obj.timestamp} \n\n`;
        }
    };
    xhttp.open("GET", searchURL, true);
    xhttp.send();

}