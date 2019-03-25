require('dotenv').config();
const connectionString = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});

/*function getPiTypes(req, res) {
    const pieResults = [
        {id: 12,  type: "pumpkin"},
        {id: 342, type: "cherry"},
        {id: 4,   type: "pecan"},
        {id: 122, type: "pizza"}
    ];

    res.json(pieResults);
}*/

/*function getPi(req, res) {
    const id = req.params.id;
    console.log(`request for pi with id : ${id}`);


    const result = {
        id: id, 
        type: "cherry",
        calories: 150,
        quantity: 3
    };

    res.json(result);
}*/

function createGoal(req, res) {
    console.log("creating a pi");

    const freq = req.body.frequency;
    const name = req.body.name;
    //const calories = req.body.calories;

    console.log(`name: ${name} freq: ${freq}`);

    const q = `INSERT INTO goal 
        ( name
        , entry_type
        , frequency_type
        , owner) 
        VALUES 
        ( $1, $2 , $3, 1 );`

    pool.query(q, [name, freq, 4])
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

    console.log(`querying goals for user ${user_id}`);

    const q = `select name
                    , entry_type
                    , frequency_type 
                    FROM goal 
                    WHERE owner = $1;`

    pool.query(q, [user_id])
        .then(result => res.json(result.rows))
        .catch(e => setImmediate(() => { throw e }));

    /*const result = {
          id:3
        , name: name
        , frequency:freq
    };
    
    res.json(result);*/
}

function selectGoal(req, res) {
    // TODO check that the goal is allowed to be accessed by user
    const goal_id = req.query.id;
    const user_id = 1; // TODO change when session

    console.log(`goal_id : ${goal_id}`);

    // TODO add ability to see goal if it is shared with user
    const q = `select name 
                    FROM goal 
                    WHERE goal_id = $1
                    AND owner = $2;`

    pool.query(q, [goal_id, user_id])
        .then(result => res.json(result.rows))
        .catch(e => setImmediate(() => { throw e }));
}

/******************
******************/
module.exports = {
      createGoal: createGoal
    , selectUserGoals: selectUserGoals
    , selectGoal: selectGoal
};