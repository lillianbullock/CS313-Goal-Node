const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

// to support JSON-encoded bodies
app.use(express.json());
// to support URL-encoded bodies
app.use(express.urlencoded({extended:true})); 

/**************************************
* Database setup
**************************************/
require('dotenv').config();
const connectionString = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});

/**************************************
* set up ejs
**************************************/
app.set("views", "views");
app.set("view engine", "ejs");

/**************************************
* Session
**************************************/
var session = require('express-session');

app.use(session({
    secret: 'keyboard-cat'
}));

const bcrypt = require('bcrypt');

/**************************************
* My Libraries 
**************************************/
const create = require("./controllers/create.js");
const select = require("./controllers/select.js");
const userSes = require("./controllers/user.js");

/**************************************
* Routing
**************************************/
// public dir
app.use(express.static("public"));

// everything goes through this
app.use(logRequest);

// getting stuff from the db
app.get("/goals",    verifyLogin, select.userGoals);
app.get("/goal/:id", verifyLogin, select.goal);

// posting stuff to the db
//app.post("/createGoal", createGoal);

// receiving AJAX
app.get("/createEntry", verifyLoginAJAX, create.entry);
app.get("/createGoal",  verifyLoginAJAX, create.goal);
app.get("/createUser", createUser)

app.post('/login',  userSes.login);
app.post('/logout', userSes.logout);

/***************************************
* Turn it on
***************************************/
app.listen(port, function() {
    console.log("Server listening on: " + port);
});

/***************************************
* Middleware
***************************************/
function logRequest(req, res, next) {
    console.log("Received a request for: " + req.url);

    next();
}

function verifyLoginAJAX(req, res, next) {
    if (!(typeof req.session.user == 'undefined'))
    {
        next();
    } else {
        const params = {
              status: 'failure'
            , error: 'not logged in cannot access this page'
        }; 

        res.status(401);
        res.json(params);
    }
}

function verifyLogin(req, res, next) {
    if (!(typeof req.session.user == 'undefined'))
    {
        next();
    } else {
        const params = {
              status: 'failure'
            , error: 'not logged in cannot access this page'
        }; 

        res.status(401);
        res.json(params);

        res.render(reroute, params);
    }
}

/***************************************
* Functions in progress
***************************************/
function createAccount() {
    bcrypt.hash('myPassword', 10, function(err, hash) {
        // Store hash in database
        console.log(`login() => hash: ${hash}`)
        
        const q = `INSERT user_id
            , password
            FROM usr
            WHERE email = $1;`;
    

    });
      
}

function createUser(req, res) {
    
    const name = req.query.name;
    const email = req.query.email;
    const pass = req.query.pass;

    console.log(`createGoal() => name: ${name} email: ${email}`);

    bcrypt.hash(pass, 10, function(err, hash) {
        // Store hash in database
        console.log(`login() => hash: ${hash}`)

        const q = `INSERT INTO usr 
        ( username
        , email
        , password) 
        VALUES 
        ( $1, $2, $3);`;

        var status = 'failure';

        pool.query(q, [name, email, hash])
            .then(result => {status = 'user created'})
            .catch(e => setImmediate(() => { console.log(e)}));        

        const result = {
            status: status
        };
        
        res.json(result);
    });
}
