const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

const controller = require("./controllers/goal.js")

app.use(express.static("public"));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies

//app.get("/piTypes", controller.getPiTypes);
//app.get("/pi/:id", controller.getPi);

app.post("/create_goal", controller.createGoal);


app.listen(port, function() {
    console.log("Server listening on: " + port);

});