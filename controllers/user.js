require('dotenv').config();
const connectionString = process.env.DATABASE_URL;

const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});

const bcrypt = require('bcrypt');

/**************************************
* pass lib
**************************************/

function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    console.log(`email: ${email}`);
    console.log(`password: ${password}`);

    const q = `select user_id
                , username as name
                , password
                FROM usr
                WHERE email = $1;`;

    pool.query(q, [email], (err, result) => {
        if (err) {
            throw err
        }

        console.log('login() => results:', result.rows);

        bcrypt.compare(password, result.rows[0].password, function(err2, result2) {
            if(result2) {
                const params = {
                    success: true
                }; 
        
                console.log(`login() => success`);

                req.session.user = {
                      name: result.rows[0].name
                    , email: email
                    , id: result.rows[0].user_id
                };

                res.json(params);
            } else {
                const params = {
                    success: false
                }; 
        
                console.log(`login() => failure`);

                res.json(params);
            } 

            console.log(``);

        });
    });

    /*if (username == "admin" && password == "password"){
        if (!req.session.user) {
            req.session.user = {
                username: username
            };
        }

        const params = {
            success: true
        }; 

        res.json(params);
    } else {
        const params = {
            success: false
        };

        res.json(params); 
    }*/
}

function logout(req, res) {
    if (typeof req.session.user == 'undefined') {
        req.session.user = undefined;

        const params = {
            success: false
        }; 
    
        res.json(params);
    } else {
        req.session.destroy();

        const params = {
            success: true
        }; 

        res.json(params);
    }
}

/******************
******************/
module.exports = {
    login: login
  , logout: logout
};