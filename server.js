const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

/* Import this file  */
const controller = require("./controllers/goal.js")

app.use(express.static("public"));

// lets the post queries be easily read
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies

//app.get("/piTypes", controller.getPiTypes);
app.get("/goals", controller.selectUserGoals);

app.post("/create_goal", controller.createGoal);


app.listen(port, function() {
    console.log("Server listening on: " + port);
});
