const express = require("express");
const movies = require("./movies");
const connection = require("./config");

const port = 3000;
const app = express();

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.get("/", (req, res) => {
  res.send("Welcome to my favourite movie list!");
});

app.get('/api/movies', (req, res) => {
    let sql = 'SELECT * FROM movies';
    const sqlValues = [];
    
    if (req.query.color) {
      sql += ' WHERE color = ?';
      sqlValues.push(req.query.color);
    }
    
    connection.query(sql, sqlValues, (err, results) => {
      if (err) {
        res.status(404).send(`Movie not found`);
      } else {
        res.json(results);
      }
    });
});

app.get("/api/movies/:id", (req, res) => {
  connection.query(
    `SELECT * from movies WHERE id=?`,
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send("Movie not found");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/api/search", (req, res) => {
  connection.query(
    "SELECT * from movies WHERE duration <= ?",
    [req.query.maxDuration],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send("No movies found for this duration");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/api/user", (req, res) => {
  res.status(401).send("Unauthorized");
});

app.listen(port, () => {
  console.log(`Server is runing on 3000`);
});