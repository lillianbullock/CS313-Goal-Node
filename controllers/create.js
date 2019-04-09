require('dotenv').config();
const connectionString = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});

function formatDate(datetime) {
    var arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var dateStr = datetime.getDate() + " "+ arr[datetime.getMonth()] 
                    + " " + datetime.getFullYear();

    //console.log(`formatDate => date: ${dateStr}`);

    return dateStr;
}

function createGoal(req, res) {
    
    const freq = req.query.frequency;
    const name = req.query.name;
    const entry = req.query.entry;
    const u_id = req.session.user.id;

    console.log(`createGoal() => name: ${name} freq: ${freq} entry: ${entry}`);

    const q = `INSERT INTO goal 
        ( name
        , entry_type
        , frequency_type
        , owner) 
        VALUES 
        ( $1, $2 , $3, $4 );`

    pool.query(q, [name, entry, freq, u_id])
        //.then(res => console.log('user:', res.rows[0]))
        .catch(e => setImmediate(() => { throw e }));

    const result = {
          id: 'unknown'
        , name: name
        , frequency:freq
        , entry:entry
    };
    
    res.json(result);
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

        // TODO is there a way to get back what it created

        //console.log('createEntry() => result:', result.rows);
        
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


/******************
******************/
module.exports = {
      goal: createGoal
    , entry: createEntry
//    , selectGoal: selectGoal
};