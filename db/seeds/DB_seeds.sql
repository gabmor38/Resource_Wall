-- Users table seeds here (Example)
INSERT INTO users (email, password) VALUES ('Alice@gmail.com', 'password123');
INSERT INTO users (email, password) VALUES ('Kira@yahoo.com','password12');
INSERT INTO users (email, password) VALUES ('Leila@hotmail.com', 'password');

INSERT INTO resources (number_of_likes, url, title, description, category, date) VALUES (3, 'https://jquery.com', 'Jquery', 'Jquery documentation', 'Computer Science','2021-09-10');
INSERT INTO resources (number_of_likes, url, title, description, category, date) VALUES (2,'https://www.khanacademy.org/math', 'Math', 'Math article and exercises','Math', '2020-01-01');
INSERT INTO resources (number_of_likes, url, title, description, category, date) VALUES (1,'https://brainyball.blogspot.com','Learn Math','Math blog','Math','2021-02-05');
INSERT INTO resources (number_of_likes, url, title, description, category, date) VALUES (4,'https://science4fun.info','Learn Science','Informative article','Science','2021-02-05');

INSERT INTO reviews (rating, message, date) VALUES ('4','Great documentation','2021-09-12');
INSERT INTO reviews (rating, message, date) VALUES ('4','Very informative','2020-06-03');
INSERT INTO reviews (rating, message, date) VALUES ('2','Needs more information','2021-06-03');
INSERT INTO reviews (rating, message, date) VALUES ('3','Fun article about science','2021-06-03');

