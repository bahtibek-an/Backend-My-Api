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
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs')


const checkAdmin = async (req, res, next) => {
  const { username } = req.body;
  try {
    const { rows } = await pool.query('SELECT role FROM users WHERE username = $1', [username]);
    const userRole = rows[0].role;
    if (userRole === true) {
      next();
    } else {
      res.redirect("/home") 
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};


app.get("/", async (req, res) => {
  res.status(200).render("form", {})
})

app.get("/signup", (req, res) => {
  res.status(200).render("signup", { title: "sign up", })
})

app.get("/home", (req, res) => {
  const username = req.query.username;
  res.status(200).render("home", { title: "Home Page", username: username });
})

app.get("/login", (req, res) => {
  res.status(200).render("login", { title: "login page" })
})

app.get("/update/:id", (req, res)=>{
  res.status(200).render("update", {title:"update page"})
})

app.get("/post", (req, res)=>{
  res.status(200).render("post", {title:"post page"})
})

app.get("/admin", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM earthquake')
    const earthquakeData = result.rows;
    res.status(200).render('adminpage', { title: "admin page", earthquakeData })
    console.log(earthquakeData)
  } catch (error) {
    console.error('Error retrieving data from the database', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
})

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body
  try {
    const result = await pool.query("INSERT INTO users (username , email , password , role ) VALUES ($1 , $2 , $3, true) returning *", [username, email, password])
    console.log(req.params);
    console.log(result.params);
    if (result.rows.length > 0) {
      res.redirect(`/home?username=${username}`);
    } else {
      res.send(error.message)
    }
  } catch (error) {
    console.error(error);
  }
  console.log("seccessful");
})

app.post("/login", checkAdmin, async (req, res) => {
  const { username, password } = req.body
  try {
    const results = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password])
    console.log(results.rows[0]);
    if (checkAdmin) {
      res.redirect("/admin")
    } else {
      res.redirect("/home")
    }
  } catch (error) {
    console.error(error);
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


app.post("/post", async (req, res) => {
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