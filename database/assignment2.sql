

-- W03, Assignment 2: Server SQL Queries

-- 1. Insertion of Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES (
    'Tony', 
    'Stark', 
    'tony@starkent.com', 
    'Iam1ronM@n'
);

SELECT account_firstname, account_lastname, account_email, account_password
FROM account;


-- 2. Update account type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

SELECT account_firstname, account_lastname, account_type
FROM account;


-- 3. Deletion of Tony Stark
DELETE FROM account 
WHERE account_firstname = 'Tony';

SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type
FROM account;


SELECT inv_make, inv_model, inv_description 
FROM inventory
WHERE inv_make = 'GM';


-- 5. Query with INNER JOIN to get Sports cars
SELECT inv_make, inv_model, classification_name
FROM inventory i
INNER JOIN classification c 
	ON i.classification_id = c.classification_id
WHERE c.classification_id = 2;


-- 4. Update with REPLACE to a string
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_make = 'GM';


-- 6. Update with REPLACE in the middle of string
UPDATE inventory
SET 
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), 
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

SELECT inv_image, inv_thumbnail FROM inventory;



DELETE FROM classification
WHERE classification_id IN (6, 7, 8, 9, 10);



-- Restoration code for database

-- 4. Restoration
-- UPDATE inventory
-- SET inv_description = REPLACE(inv_description, 'huge interior', 'small interiors')
-- WHERE inv_make = 'GM';

-- SELECT inv_make, inv_model, inv_description 
-- FROM inventory
-- WHERE inv_make = 'GM';


-- 6. Restoration
-- UPDATE inventory
-- SET 
-- 	inv_image = REPLACE(inv_image, '/vehicles', ''), 
-- 	inv_thumbnail = REPLACE(inv_thumbnail, '/vehicles', '');

-- UPDATE inventory
-- SET 
-- 	inv_image = REPLACE(inv_image, '/images', ''), 
-- 	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '');

-- UPDATE inventory
-- SET
-- 	inv_image = concat('/images', inv_image), 
-- 	inv_thumbnail = concat('/images', inv_thumbnail);

-- SELECT inv_image, inv_thumbnail FROM inventory;

