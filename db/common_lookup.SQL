-- ----------------------------------------------------------------------------
-- Inserts 
-- ----------------------------------------------------------------------------

-- goal(frequency_type)

Insert into common_lookup 
( table_name
, column_name
, value
, label)
VALUES
( 'GOAL'
, 'FREQUENCY_TYPE'
, 'DAILY'
, 'Daily');

Insert into common_lookup 
( table_name
, column_name
, value
, label)
VALUES
( 'GOAL'
, 'FREQUENCY_TYPE'
, 'WEEKLY'
, 'Weekly');

-- goal(type)

Insert into common_lookup 
( table_name
, column_name
, value
, label)
VALUES
( 'GOAL'
, 'ENTRY_TYPE'
, 'CHECKBOX'
, 'Checkbox');

Insert into common_lookup 
( table_name
, column_name
, value
, label)
VALUES
( 'GOAL'
, 'ENTRY_TYPE'
, 'NUMERICAL'
, 'Numerical');