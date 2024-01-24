const express = require("express");
const sqlite3 = require("sqlite3");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database("sae.db");

app.use(express.json());

app.use(cors()); // Ajoutez cette ligne pour activer CORS


// LOGIN
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  console.log(req.body)

  const query = `SELECT * FROM User WHERE name = ?`;
  db.get(query, [name], (err, Utilisateur) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!Utilisateur || password!=Utilisateur.password) {
      console.log(Utilisateur)
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ UserID: Utilisateur.user_id }, 'token', { expiresIn: '1h' });

    res.json({ token, user_id: Utilisateur.user_id });
  });
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, 'token', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalide' });
    }
    req.UserID = decoded.UserID;
    next();
  });
}

  
// Ajouter un utilisateur
app.post("/register", (req, res) => {
  db.all(`INSERT INTO User (name, password) VALUES ("${req.body.name}","${req.body.password}");`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.send(`L'utilisateur ${req.body.name} a été ajouté.`);
  });
});

// Get bracelet
app.get('/bracelet', (req, res) => {
    db.all("SELECT * FROM Bracelet", (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ rows });
    });
  });

// Get fond
app.get('/fond', (req, res) => {
    db.all("SELECT * FROM Fond", (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ rows });
    });
  });

// Get montre
app.get('/montre-single/:id', verifyToken, (req, res) => {
  const UserID = req.UserID;
    db.all("SELECT Montre.boitier, Bracelet.url AS braceletUrl, Fond.url AS fondUrl, Bracelet.prix AS Bprix, Fond.prix AS Fprix, (Bracelet.prix+Fond.prix) AS Total FROM Montre, Bracelet, Fond WHERE Montre.montre_id=" + req.params.id + " AND Montre.fond_id = Fond.fond_id AND Montre.bracelet_id = Bracelet.bracelet_id AND Montre.user_id =" + UserID, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ rows });
    });
  });

// Get name user
app.get('/username', verifyToken, (req, res) => {
  const UserID = req.UserID;
    db.all("SELECT name FROM User WHERE User.user_id=" + UserID, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ rows });
    });
  });

// Get montre list user
app.get('/montre-list', verifyToken, (req, res) => {
  const UserID = req.UserID;
    db.all("SELECT Montre.boitier, Bracelet.name AS braceletName, Montre.montre_id, Bracelet.prix AS Bprix, Fond.prix AS Fprix, (Bracelet.prix+Fond.prix) AS Total FROM Montre, Bracelet, Fond WHERE Montre.user_id=" + UserID + " AND Montre.fond_id = Fond.fond_id AND Montre.bracelet_id = Bracelet.bracelet_id", (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ rows });
    });
  });

// Création montre
app.post("/create", verifyToken, (req, res) => {
  console.log(req.body)
  const UserID = req.UserID;
  db.all(`INSERT INTO Montre (boitier, bracelet_id, fond_id, user_id) VALUES (${req.body.boitier}, ${req.body.bracelet_id}, ${req.body.fond_id}, ${UserID});`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.send(`Montre sauvegardée`);
  });
});
// Update montre
app.put("/update/:id", verifyToken, (req, res) => {
  const UserID = req.UserID;
  db.all(`UPDATE Montre SET boitier=${req.body.boitier}, bracelet_id=${req.body.bracelet_id}, fond_id=${req.body.fond_id} WHERE user_id=${UserID} AND montre_id=${req.body.montre_id};`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.send(`Montre sauvegardée`);
  });
});
// Add to cart
app.post("/addtocart/:id", verifyToken, (req, res) => {
  const UserID = req.UserID;
  db.all(`INSERT INTO Panier (user_id, montre_id) VALUES (${UserID}, ${req.params.id});`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.send(`Montre sauvegardée`);
  });
});
// Get cart
app.get("/cart", verifyToken, (req, res) => {
  const UserID = req.UserID;
  db.all(`SELECT Montre.boitier, Bracelet.name AS braceletName, Montre.montre_id, Bracelet.prix AS Bprix, Fond.prix AS Fprix, (Bracelet.prix+Fond.prix) AS Total FROM Montre, Bracelet, Fond, Panier WHERE Montre.fond_id = Fond.fond_id AND Montre.bracelet_id = Bracelet.bracelet_id AND Montre.montre_id=Panier.montre_id AND Panier.user_id=${UserID}`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({rows});
  });
});
// Delete montre
app.delete("/cart/:id", verifyToken, (req, res) => {
  const UserID = req.UserID;
  db.all(
    `DELETE FROM Panier WHERE Panier.montre_id=${req.params.id} AND Panier.user_id=${UserID}`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.send("La montre ID " + req.params.id + " a été supprimée.");
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
