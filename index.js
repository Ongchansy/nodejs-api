//require express and cors
const express = require("express");
const cors = require("cors");

// pool data from db.js
const pool = require("./db");

//create an instance of express
const app = express();

// middleware dsfd
app.use(cors());
app.use(express.json());

// create a route for sort data and order
app.get("/api/todoList", (req, res) => {
  const { sort, order } = req.query;
  const sortQuery = sort ? `ORDER BY ${sort} ${order}` : "";
  pool.query(`SELECT * FROM cars ${sortQuery}`, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
      console.log(result.rows);
    }
  });
});

//create a route for post of insert data
app.post("/api/todoList", async (req, res) => {
  try {
    const { brand, model, year, id } = req.body;

    // Insert the new car into the database
    await pool.query(
      "INSERT INTO cars (brand, model, year, id) VALUES ($1, $2, $3, $4)",
      [brand, model, year, id]
    );

    // Send a success response
    res.sendStatus(200);
  } catch (err) {
    // Log any errors and send a 500 status code
    console.error(err);
    res.sendStatus(500);
  }
});

//create a route for get of specific data
app.get("/api/view/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM cars WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.json(result.rows);
      console.log(result.rows);
    }
  });
});

// create a route to delete
app.delete("/api/todoList/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cars WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// create a route to update
app.put("/api/todoList/:id", async (req, res) => {
  try {
    const { brand, model, year, id } = req.body;
    await pool.query(
      "UPDATE cars SET brand = $1, model = $2, year = $3 WHERE id = $4",
      [brand, model, year, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// listen for requests
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
