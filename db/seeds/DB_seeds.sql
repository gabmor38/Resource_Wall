-- Users table seeds here (Example)
INSERT INTO users (email, password) VALUES ('Alice@gmail.com', 'password123');
INSERT INTO users (email, password) VALUES ('Kira@yahoo.com','password12');
INSERT INTO users (email, password) VALUES ('Leila@hotmail.com', 'password');

INSERT INTO resources (user_id, number_of_likes, url, title, description, category, date) VALUES (1, 3, 'https://jquery.com', 'Jquery', 'Jquery documentation', 'technology','2021-09-10');
INSERT INTO resources (user_id, number_of_likes, url, title, description, category, date) VALUES (1, 2,'https://www.khanacademy.org/math', 'Math', 'Math article and exercises','science', '2020-01-01');
INSERT INTO resources (user_id, number_of_likes, url, title, description, category, date) VALUES (1, 1,'https://brainyball.blogspot.com','Learn Math','Math blog','math','2021-02-05');
INSERT INTO resources (user_id, number_of_likes, url, title, description, category, date) VALUES (1, 4,'https://science4fun.info','Learn Science','Informative article','science','2021-02-05');

INSERT INTO reviews (resource_id, user_id, rating, message, date) VALUES (1, 1, 4,'Great documentation','2021-09-12');
INSERT INTO reviews (resource_id, user_id, rating, message, date) VALUES (2, 1, 4,'Very informative','2020-06-03');
INSERT INTO reviews (resource_id, user_id, rating, message, date) VALUES (3, 1, 2,'Needs more information','2021-06-03');
INSERT INTO reviews (resource_id, user_id, rating, message, date) VALUES (4, 1, 1,'Fun article about science','2021-06-03');

