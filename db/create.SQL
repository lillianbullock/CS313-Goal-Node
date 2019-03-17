CREATE TABLE common_lookup
( common_lookup_id	  serial		PRIMARY KEY
, table_name		  varchar(40)	NOT NULL
, column_name	      varchar(40)	NOT NULL
, value		          varchar(40)	NOT NULL 
, label               varchar(40)   NOT NULL
);

CREATE TABLE usr
( user_id 	serial	   PRIMARY KEY
, username 	varchar(20)	   NOT NULL
, email     varchar(20)    NOT NULL
, password varchar(255)
, CONSTRAINT unique_user_email UNIQUE (email)
);

CREATE TABLE goal
( goal_id	        serial		PRIMARY KEY
, name		        varchar(40)	NOT NULL
, entry_type		integer		NOT NULL
, frequency_type	integer		NOT NULL
, owner             integer     NOT NULL 
, CONSTRAINT fk_entry_type      FOREIGN KEY (entry_type) 
    REFERENCES common_lookup(common_lookup_id)
, CONSTRAINT fk_frequency_type  FOREIGN KEY (frequency_type) 
    REFERENCES common_lookup(common_lookup_id)
, CONSTRAINT fk_owner FOREIGN KEY (owner)
    REFERENCES usr(user_id)
);
 
CREATE TABLE access 
( access_id     serial		PRIMARY KEY
, user_id 	integer		NOT NULL
, goal_id	    integer		NOT NULL
, can_edit	    bool		NOT NULL
, CONSTRAINT fk_user_id   FOREIGN KEY (user_id)
    REFERENCES usr(user_id)
, CONSTRAINT fk_goal_id     FOREIGN KEY (goal_id)
    REFERENCES goal(goal_id)
);

CREATE TABLE goal_entry
( g_entry_id	serial		PRIMARY KEY
, goal_id	    integer 	NOT NULL
, input		    varchar(60)	NOT NULL
, timestamp	    date		NOT NULL
, CONSTRAINT fk_goal_id     FOREIGN KEY (goal_id) 
    REFERENCES goal(goal_id)
);
