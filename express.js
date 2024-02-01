const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser")
require("dotenv").config()
const app = express()
// const port = 3300;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs')



app.get("/", async (req, res)=>{
  try {
    const result = await pool.query('SELECT * FROM earthquake')
    const earthquakeData = result.rows;
    res.status(200).send(earthquakeData)
  } catch (error) {
    console.error('Error retrieving data from the database', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
})


app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { location, latitude, longitude, magnitude, depth, date_time, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE earthquake SET location = $1, latitude = $2, longitude = $3, magnitude = $4, depth = $5, date_time = $6, description = $7 WHERE id = $8',
      [location, latitude, longitude, magnitude, depth, date_time, description, id]
    );
    res.status(200).send({ message: 'Update successful' });
  } catch (error) {
    console.error('Error updating data in the database', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM earthquake WHERE id = $1', [id]);
    res.status(200).send({ message: 'Delete successful' });
  } catch (error) {
    console.error('Error deleting data from the database', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.post("/post", async (req, res)=>{
  const { location, latitude, longitude, magnitude, depth, date_time, description } = req.body;
  try {
    const result = await pool.query('INSERT INTO earthquake (location, latitude, longitude, magnitude, depth, description, date_time) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
    [location, latitude, longitude, magnitude, depth, description, date_time]);
    res.status(200).send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).send('Error inserting data',);
  }
})




app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
})