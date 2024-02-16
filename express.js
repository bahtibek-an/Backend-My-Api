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
      res.json("not admin")
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};


app.get("/", async (req, res) => { 
  try {
    const result = await pool.query('SELECT * FROM earthquake')
    const earthquakeData = result.rows;
    res.status(200).json(earthquakeData)
    // res.status(200).json("home page")
  } catch (error) {
    console.error('Error retrieving data from the database', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
})

app.get("/home", async (req, res) => {
  const username = req.query.username;
  const id = req.query.id;
  try {
    const result = pool.query("select * from users where id = $1", [id])
    const user = result.rows
    res.status(200).json("main page", username);
  } catch (error) {
    console.error(error);
  }
 
})

app.get("/admin", async (req, res) => {
 try {
    const result = await pool.query('SELECT * FROM users')
    const users = result.rows;
    res.status(200).json(users)
    // console.log(earthquakeData)
  } catch (error) {
    console.error('Error retrieving data from the database', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
})



app.get('/users/:userId/edit', async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
    const user = result.rows[0]
    res.status(200).json("edit users information")
    console.log(user) 
  } catch (error) {
    console.error(error);
  }
});


app.get('/user/:id/profile', async (req, res) => {
  const userId = req.user.userId; 
  try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = result.rows[0];
      if (!user) {
          return res.status(404).send('User not found');
      }
      console.log(user);
      res.status(200).json("user profile")
  } catch (error) {
      console.error(error.message);
  }
});



app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body
  try {
    const result = await pool.query("INSERT INTO users (username , email , password  ) VALUES ($1 , $2 , $3) returning *", [username, email, password])
    console.log(req.params);
    console.log(result.params);
    if (result.rows.length > 0) {
      res.status(200).json("informations uploaded successful")
    } else {
      res.send(error.message)
    }
  } catch (error) {
    console.error(error);
  }
})

app.post("/login", checkAdmin, async (req, res) => {
  const { username, password } = req.body;
  try {
    const results = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);
    const user = results.rows[0];
    if (user) {
      if (checkAdmin) {
        res.json({ message: "admin user", username: user.username });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


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

app.post('/users/:userId/edit', async (req, res) => {
  const userId = req.params.userId;
  const { role } = req.body;
  try {
    const result = await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role ,  userId])
    res.status(200).json("edit user's role")
  } catch (error) {
    console.error(error);
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

app.delete('/users/:userId/delete', async (req, res) => {
  const userId = req.params.userId;
  try {
    const result= pool.query('DELETE FROM users WHERE id = $1', [userId])
    res.redirect('/users');
  } catch (error) {
    console.error(error);
  }
});


app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
})