const express = require("express");
const movies = require("./movies");
const connection = require("./config");

const port = 3001;
const app = express();

//CONNECTION TO DATABASE
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

//MIDDLEWARE (toujours pas compris à quoi sert ce foutu machin)
app.use(express.json());

//MAIN ROUTE
app.get("/", (req, res) => {
  res.send("Welcome to my favorite movie list");
});

//MOVIES
app.get("/api/movies", (req, res) => {
  connection.query("SELECT * from movies", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
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
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/api/search", (req, res) => {
  connection.query(
    `SELECT * from movies WHERE duration<=?`,
    [req.query.durationMax],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES(?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving a movie");
      } else {
        res.status(200).send("Successfully saved");
      }
    }
  );
});

app.put("/api/movies/:id", (req, res) => {
  const idMovie = req.params.id;// We get the ID from the url:
  const newMovie = req.body;// We get the data from the req.body
  connection.query(
    "UPDATE movies SET ? WHERE id = ?",
    [newMovie, idMovie],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a movie");
      } else {
        res.status(200).send("Movie updated successfully 🎉");
      }
    }
  );
});

app.delete("/api/movies/:id", (req, res) => {
  const idMovie = req.params.id; 
  connection.query("DELETE FROM movies WHERE id = ?", [idMovie], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting a movie");
    } else {
      res.status(200).send("🎉 Movie deleted!");
    }
  });
});

//USERS
app.get('/api/users', (req, res) => {
  let sql = 'SELECT * FROM users';//store the SQL query in a variable (in let as it is subject to change)
  const sqlValues = [];//declare an empty array, which may contain values to pass to this query
  
  if (req.query.city) {
    sql += ' WHERE city = ?';
    sqlValues.push(req.query.city);
  }
  
  connection.query(sql, sqlValues, (err, results) => {
    if (err) {
      // If an error has occurred, then the client is informed of the error
      res.status(500).send(`An error occurred: ${err.message}`);
    } else {
      // If everything went well, we send the result of the SQL query as JSON
      res.json(results);
    }
  });
});

app.get("/api/users/:id", (req, res) => {
  const idUser = req.params.id;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error getting a User");
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    "INSERT INTO users(firstname, lastname, email) VALUES(?, ?, ?)",
    [firstname, lastname, email],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving a User");
      } else {
        res.status(200).send("Successfully saved");
      }
    }
  );
});

app.put("/api/users/:id", (req, res) => {
  const idUser = req.params.id;// We get the ID from the url:
  const newUser = req.body;// We get the data from the req.body
  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [newUser, idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        res.status(200).send("User updated successfully 🎉");
      }
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  const idUser = req.params.id; 
  connection.query("DELETE FROM users WHERE id = ?", [idUser], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting an user");
    } else {
      res.status(200).send("🎉 User deleted!");
    }
  });
});

//PORT
app.listen(port, () => {
  console.log(`Server is runing on 3000`);
});