const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

require('dotenv').config();
const connectionString = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});

app.use(express.static("public"));

// lets the post queries be easily read
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies

/******************
* ejs stuff
******************/
app.set("views", "views");
app.set("view engine", "ejs");

/* Import this file  */
//const controller = require("./controllers/goal.js");

/******************
* get and post paths
******************/

// getting stuff from the db
app.get("/goals", selectUserGoals);
app.get("/goal/:id", selectGoal);

// posting stuff to the db
//app.post("/createGoal", createGoal);

// receiving AJAX
app.get("/createEntry", createEntry);
app.get("/createGoal", createGoal);



app.listen(port, function() {
    console.log("Server listening on: " + port);
});

/******************
* functions - eventually figure out how to move to controller file and deal 
* with needed libraries
******************/

function createGoal(req, res) {
    
    const freq = req.query.frequency;
    const name = req.query.name;
    const entry = req.query.entry;
    //const calories = req.body.calories;

    console.log(`createGoal() => name: ${name} freq: ${freq} entry: ${entry}`);

    const q = `INSERT INTO goal 
        ( name
        , entry_type
        , frequency_type
        , owner) 
        VALUES 
        ( $1, $2 , $3, 1 );`

    pool.query(q, [name, entry, freq])
        //.then(res => console.log('user:', res.rows[0]))
        .catch(e => setImmediate(() => { throw e }));

    const result = {
          id:3
        , name: name
        , frequency:freq
    };
    
    res.json(result);
}

function selectUserGoals(req, res) {
    const user_id = 1; // TODO change when session

    console.log(`selectUserGoals() => querying goals for user ${user_id}`);

    const q = `select u.username
                , g.name
                , cl1.label as type
                , cl2.label as frequency 
                FROM goal g join common_lookup cl1 
                ON g.entry_type = cl1.common_lookup_id 
                JOIN common_lookup cl2 
                ON g.frequency_type = cl2.common_lookup_id
                JOIN usr u
                ON g.owner = u.user_id
                WHERE g.owner = $1;`

   pool.query(q, [user_id], (err, result) => {
        if (err) {
            throw err
        }
        
        console.log('selectGoal() => goals: ', result.rows);
        
        var entries = "";
        result.rows.forEach((row) => {

            entries += `name: ${row.name} \n`;
            entries += `entry_type: ${row.type} \n`;
            entries += `frequency: ${row.frequency} \n\n`;
        });

        1980-08-26

        // EJS stuff
        const params = {
              name: result.rows[0].username
            , entries: entries  
        };
    
        res.render("goal_list", params);
    });
}

function formatDate(datetime) {
    var arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var dateStr = datetime.getDate() + " "+ arr[datetime.getMonth()] 
                    + " " + datetime.getFullYear();

    //console.log(`formatDate => date: ${dateStr}`);

    return dateStr;
}

function selectGoal(req, res) {
    const goal_id = req.params.id;
    const user_id = 1; // TODO change when session

    console.log(`selectGoal() => goal_id : ${goal_id}`);

    // TODO add ability to see goal if it is shared with user
    const q = `select goal_id
                , name
                , owner
                , frequency_type
                , entry_type
                    FROM goal 
                    WHERE goal_id = $1
                    AND owner = $2;`

    // now get the entries
    pool.query(q, [goal_id, user_id], (err, result) => {
        if (err) {
            throw err
        }
        
        console.log('selectGoal() => goal: ', result.rows[0]);
        console.log('selectGoal() => name: ', result.rows[0].name);

        const q2 = `select g_entry_id
                , input
                , timestamp
                FROM goal_entry
                WHERE goal_id = $1;`

        pool.query(q2, [goal_id], (err2, result2) => {
            if (err2) {
                throw err2
            }

            console.log('selectGoal() => Goal Entries:', result2.rows);
            
            var entries = "";
            result2.rows.forEach((row) => {

                dateStr = formatDate(row.timestamp);

                entries += `Input: ${row.input} \n`;
                entries += `Timestamp: ${dateStr} \n\n`;
            })

            1980-08-26

            // EJS stuff
            const params = {
                id: result.rows[0].goal_id
                , name: result.rows[0].name
                , entry_t: result.rows[0].entry_type
                , freq: result.rows[0].frequency_type
                , owner: result.rows[0].owner
                , entries: entries  
            };
        
            res.render("goal", params);

        });
    });
}

function createEntry(req, res) {
    const goal_id = req.query.id;
    const input = req.query.input;
    // TODO add ability to change date

    if (input == "")
    {
        // stop here, bad data
        res.status(500);
        return;
    }

    // TODO check that the user has permissions to add an entry

    const q = `Insert into goal_entry
                ( goal_id
                , input
                , timestamp)
                VALUES 
                ( $1
                , $2
                , Now());`

    pool.query(q, [goal_id, input], (err, result) => {
        if (err) {
            throw err
        }

        console.log('createEntry() => result:', result.rows);
        
        var now = new Date();
        dateStr = formatDate(now);

        const data = {
              input: input
            , timestamp: dateStr
        };

        res.json(data);

        /*// EJS stuff
        const params = {
            id: result.rows[0].goal_id
            , name: result.rows[0].name
            , entry_t: result.rows[0].entry_type
            , freq: result.rows[0].frequency_type
            , owner: result.rows[0].owner
            , entries: entries
        };
    
        res.render("goal", params);*/

    });


}