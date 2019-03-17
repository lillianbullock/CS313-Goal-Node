-- common_lookup will never be inserted into on the user side,
-- so no template for PDO

INSERT INTO goal
( name
, entry_type
, frequency_type)
VALUES
( name
, (SELECT common_lookup_id from common_lookup 
   where column_name = 'ENTRY_TYPE'
   AND   table_name = 'GOAL'
   AND  value = entry)
, (SELECT common_lookup_id from common_lookup 
   where column_name = 'FREQUENCY_TYPE'
   AND   table_name = 'GOAL'
   AND  value = frequency)
 );

INSERT INTO person
( f_name
, l_name
, email)
VALUES
( f_name
, l_name
, email);

-- might need to replace the goal one with somehow getting the id direct
-- because the name isn't actually unique
INSERT INTO access
( person_id
, goal_id
, level_type)
VALUES
( (SELECT person_id
  FROM person 
  WHERE email = email)
, (SELECT goal_id 
  FROM goal
  WHERE name = name)
, (SELECT common_lookup_id from common_lookup 
   where column_name = 'LEVEL_TYPE'
   AND   table_name = 'ACCESS'
   AND  value = frequency)
);


INSERT INTO access
( person_id
, goal_id
, level_type)
VALUES
( (SELECT person_id
  FROM person 
  WHERE email = 'bul16005@byui.edu')
, (SELECT goal_id 
  FROM goal
  WHERE name = 'Scripture Study')
, (SELECT common_lookup_id FROM common_lookup 
   WHERE column_name = 'LEVEL_TYPE'
   AND   table_name = 'ACCESS'
   AND  value = 'OWNER')
);


Select g.name, cl.value
FROM goal g JOIN access a
ON g.goal_id = a.goal_id
JOIN common_lookup cl
ON a.level_type = common_lookup_id;


 INSERT INTO goal_entry
( goal_id
, input
, timestamp)
VALUES
( goal_id
, input
, NOW() );


SELECT ge.input, ge.timestamp
FROM goal g INNER JOIN goal_entry ge
ON g.goal_id = goal_id;


Select g.goal_id
      , g.name
      , cl1.label as entry_type
      , cl2.label as frequency
FROM goal g JOIN access a
ON g.goal_id = a.goal_id
AND a.person_id = person_id
JOIN common_lookup cl1 
ON entry_type = cl1.common_lookup_id
JOIN common_lookup cl2 
ON frequency_type = cl2.common_lookup_id
WHERE owner = person_id;