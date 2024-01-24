INSERT INTO User (name, password) VALUES ('test', 'mdp');

ALTER TABLE Bracelet
ADD name TEXT

ALTER TABLE Montre ADD user_id INT

INSERT INTO Bracelet (url, prix, name) VALUES ('texture-cuir-blanc.jpg','15','Cuir blanc'),('texture-tissus-marron.jpg','8','Tissu marron'),('texture-tissus-or.jpg','8','Tissu or');

INSERT INTO Fond (url, prix) VALUES ('background_black01.png','5'),('background_black02.png','5'),('background_fluo01.png','8'),('background_mickey.png','5'),('background_white01.png','3'),('background_white02.png','3'),('background_white03.png','3'),('background_white04.png','3'),('background_white05.png','3');

INSERT INTO Montre (boitier, fond_id, bracelet_id) VALUES (true, 1, 2), (false, 5, 1), (true, 3, 3);

INSERT INTO Sauvegarde (user_id, montre_id) VALUES (2,2);