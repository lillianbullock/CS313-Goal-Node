const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

const controller = require("./controllers/pie.js")

app.use(express.static("public"));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies

app.get("/piTypes", controller.getPiTypes);
app.get("/pi/:id", controller.getPi);

app.post("/pi", controller.createPi);


app.listen(port, function() {
    console.log("Server listening on: " + port);

});

/******************
* /pie?id=42
******************/
/*
app.get("/pi", getPi);
function getPi(req, res) {
    const id = req.query.id;
    console.log("request for pi with id : ${id}");


    const result = {
        id: id, 
        type: cherry,
        calories: 150,
        quantity: 3
    };

    res.json(result);
}*/