-- Users table seeds here (Example)
INSERT INTO users (name, email, password) VALUES ('Alice','Alice@gmail.com', 'password123');
INSERT INTO users (name, email, password) VALUES ('Kira','Kira@yahoo.com','password12');
INSERT INTO users (name, email, password) VALUES ('Leila','Leila@hotmail.com', 'password');

-- resources posted by alice@gmail.com

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (1,'https://jquery.com', 'Jquery', 'Jquery documentation', 'technology', '2021-09-10');

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (1,'https://www.khanacademy.org/math',   'Math', 'Math article and exercises', 'math', '2021-09-25');


INSERT INTO resources (user_id, url, title, description, category, date) VALUES (1,'https://brainyball.blogspot.com',   'Learn Math', 'Math blog', 'math', '2021-02-05');

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (1,'https://science4fun.info','Learn Science', 'Informative article', 'science', '2021-02-05');

-- resources posted by kira@yahoo,com

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (2,'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging','Git Branching', 'git article', 'technology','2021-02-05');

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (2,'https://www.science.org/','science.org', 'Contains lots of information', 'science','2021-02-05');

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (2,'https://www.mathplayground.com/','Math kids games', 'Contains tons of math games for kids', 'math', '2021-02-05');

-- resources posted by Leila@hotmail.com

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (3,'https://www.quantamagazine.org/','Math Magazine', 'Contains intersting math articles', 'math','2021-02-05');

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (3,'https://techcrunch.com/','Startup news', 'The latest in startup and technology news', 'technology', '2021-02-05');

INSERT INTO resources (user_id, url, title, description, category, date) VALUES (3,'https://www.newscientist.com/subject/technology/','The latest in technology', 'this website has the latest in technology', 'technology','2021-02-05');

-- reviews posted by alice@gmail.com

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('9','1','2','2021-09-14');

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('8','1','3','2021-09-01');

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('7','1','4','2021-09-01');

-- reviews posted by keira@gmail.com

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('1','2','3','2021-12-12');

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('2','2','3','2021-08-12');

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('3','2','3','2021-09-01');

-- resources posted by Leila@hotmail.com

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('4','3','1','2021-09-12');

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('5','3','2','2021-09-23');

INSERT INTO reviews (resource_id, user_id, rating, date) VALUES ('6','3','2','2021-09-14');


-- saved posts by alice@gmail.com
INSERT INTO liked (user_id, resource_id) VALUES ('1','3');
INSERT INTO liked (user_id, resource_id) VALUES ('1','4');
INSERT INTO liked (user_id, resource_id) VALUES ('1','5');

-- resources posted by kira@yahoo,com
INSERT INTO liked (user_id, resource_id) VALUES ('2','2');
INSERT INTO liked (user_id, resource_id) VALUES ('2','3');
INSERT INTO liked (user_id, resource_id) VALUES ('2','9');

-- resources posted by Leila@hotmail.com
INSERT INTO liked (user_id, resource_id) VALUES ('3','1');
INSERT INTO liked (user_id, resource_id) VALUES ('3','1');
INSERT INTO liked (user_id, resource_id) VALUES ('3','3');


