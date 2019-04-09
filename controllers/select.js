require('dotenv').config();
const connectionString = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});

/******************
* 
******************/
function formatDate(datetime) {
    var arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var dateStr = datetime.getDate() + " "+ arr[datetime.getMonth()] 
                    + " " + datetime.getFullYear();

    //console.log(`formatDate => date: ${dateStr}`);

    return dateStr;
}

function selectUserGoals(req, res) {
    const user_id = req.session.user.id;
    
    console.log(`selectUserGoals() => querying goals for user ${user_id}`);

    const q = `select g.goal_id as id
            , u.username
            , g.name
            , cl1.label as type
            , cl2.label as frequency 
            FROM goal g join common_lookup cl1 
            ON g.entry_type = cl1.common_lookup_id 
            JOIN common_lookup cl2 
            ON g.frequency_type = cl2.common_lookup_id
            JOIN usr u
            ON g.owner = u.user_id
            WHERE g.owner = $1
            ORDER BY g.goal_id DESC;`;

    const q2 = `SELECT common_lookup_id as id
            , label 
            , column_name as column
            FROM common_lookup 
            WHERE table_name = 'GOAL';`;

   pool.query(q, [user_id], (err, result) => {
        if (err) {
            throw err
        }
        
        console.log('selectUserGoals() => goals: ', result.rows);
        
        var entries = "";
        // TODO add some sort of paging system
        // ie first 10 goals and a <next pg> button

        result.rows.forEach((row) => {

            entries += `<b>Name:</b> ${row.name} <br/>`;
            entries += `<b>Entry_type:</b> ${row.type} <br/>`;
            entries += `<b>Frequency:</b> ${row.frequency} <br/>`;

            entries += `<form action="../goal/${row.id}">`;  
            entries += `<input type="submit" value="See Entries">`;
            
            entries += `<input type="button" value="Delete"`;
            entries += `onclick="deleteGoal(${row.id})"><br/></form><br/>`;

            // add link to goal specific page

        });

        pool.query(q2, [], (err2, result2) => {
            if (err2) {
                throw err2
            }

            console.log('selectUserGoals() => common_lookup:', result2.rows);
            
            var entry_type = "";
            var freq_type = "";

            result2.rows.forEach((row) => {
                if (row.column == 'ENTRY_TYPE')
                {
                    entry_type += `<option value="${row.id}">${row.label}</option>\n`;
                }
                else if (row.column == 'FREQUENCY_TYPE')
                {
                    freq_type += `<option value="${row.id}">${row.label}</option>\n`;
                }  
            })

            console.log(`selectUserGoals() => entry: ${entry_type}`);
            console.log(`selectUserGoals() => freq: ${freq_type}`);

            // EJS stuff
            const params = {
                  name: req.session.user.name
                , entries: entries
                , freq_type: freq_type
                , entry_type: entry_type 
            };
        
            res.render("goal_list", params);
        });    
    });
}

function selectGoal(req, res) {
    const goal_id = req.params.id;
    const user_id = req.session.user.id;
    
    console.log(`selectGoal() => user_id: ${user_id}`);
    console.log(`selectGoal() => goal_id : ${goal_id}`);

    // TODO add ability to see goal if it is shared with user

    const q = `select u.username
                , g.name
                , cl1.label as entry
                , cl2.label as frequency 
                FROM goal g join common_lookup cl1 
                ON g.entry_type = cl1.common_lookup_id 
                JOIN common_lookup cl2 
                ON g.frequency_type = cl2.common_lookup_id
                JOIN usr u
                ON g.owner = u.user_id
                WHERE g.goal_id = $1
                AND g.owner = $2;`

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
                WHERE goal_id = $1
                ORDER BY timestamp DESC;`

        pool.query(q2, [goal_id], (err2, result2) => {
            if (err2) {
                throw err2
            }

            console.log('selectGoal() => Goal Entries:', result2.rows);
            
            var entries = "";
            result2.rows.forEach((row) => {

                dateStr = formatDate(row.timestamp);

                entries += `<b>Input:</b> ${row.input} <br/>`;
                entries += `<b>Timestamp:</b> ${dateStr}<br/><br/>`;
            })

            // EJS stuff
            const params = {
                  id: goal_id
                , name: result.rows[0].name
                , entry_t: result.rows[0].entry
                , freq: result.rows[0].frequency
                , owner: result.rows[0].username
                , entries: entries  
            };
        
            res.render("goal", params);
        });
    });
}

/******************
******************/
module.exports = {
    userGoals: selectUserGoals
  , goal: selectGoal
};