const express = require("express");
const movies = require("./characters");
const connection = require("./config");

const port = 3000;
const app = express();

//CONNECTION TO DATABASE
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

//MIDDLEWARE
app.use(express.json());
//PORT
app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});

//MAIN ROUTE
app.get("/", (req, res) => {
  res.send("Welcome to my characters list");
});

//GET ALL
app.get("/api/characters", (req, res) => {
  connection.query("SELECT * from characters", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

//GET SPECIFIC FIELDS
app.get("/api/characters-details", (req, res) => {
  connection.query(
    "SELECT id, firstname, age, species FROM characters",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

//GET with filters
app.get("/api/characters/lynx", (req, res) => {
  connection.query(
    "SELECT * FROM characters WHERE species='lynx'",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/api/characters/cl", (req, res) => {
  connection.query(
    "SELECT * FROM characters WHERE firstname LIKE '%Cl%'",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.get("/api/characters-age", (req, res) => {
  connection.query(
    "SELECT * FROM characters WHERE age > '20'",

    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

//GET by alphabetical order
app.get("/api/characters-order", (req, res) => {
  connection.query(
    "SELECT * FROM characters ORDER BY firstname ASC",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

//POST a new entity
app.post("/api/characters", (req, res) => {
  const { firstname, world, age, species, uses_magic } = req.body;
  connection.query(
    "INSERT INTO characters(firstname, world, age, species, uses_magic) VALUES(?, ?, ?, ?, ?)",
    [firstname, world, age, species, uses_magic],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving a character");
      } else {
        res.status(200).send("Character successfully saved");
      }
    }
  );
});

//PUT (modification of an entity)
app.put("/api/characters/:id", (req, res) => {
  const idCharacter = req.params.id;
  const newCharacter = req.body;
  connection.query(
    "UPDATE characters SET ? WHERE id = ?",
    [newCharacter, idCharacter],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a character");
      } else {
        res.status(200).send("Character updated successfully 🎉");
      }
    }
  );
});

//PUT to toggle boolean
app.put("/api/characters/:uses_magic", (req, res) => {
  const idBoolean = req.params.uses_magic;
  const newBoolean = req.body;
  connection.query(
    "UPDATE characters SET uses_magic = ABS(uses_magic - 1) WHERE uses_magic = 2",
    [newBoolean, idBoolean],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating boolean");
      } else {
        res.status(200).send("Boolean successfully modified 🎉");
      }
    }
  );
});

//DELETE an entity
app.delete("/api/characters/:id", (req, res) => {
  const idCharacter = req.params.id; 
  connection.query("DELETE FROM characters WHERE id = ?", [idCharacter], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting a character");
    } else {
      res.status(200).send("🎉 Character deleted!");
    }
  });
});

//DELETE where boolean is false
app.delete("/api/delete/characters", (req, res) => {
  connection.query(
    "DELETE FROM characters WHERE uses_magic = 0",
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting characters without brooms");
      } else {
        res.status(200).send("🎉 Characters without brooms deleted!");
      }
    }
  );
});
