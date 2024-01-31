//Requiring Express
const express = require('express');
const app = express();

//Requiring other modules
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const Register = require('./models/registers');

//Port declaration
const port = process.env.PORT || 3000;

//Connecting conn.js(MongoDB) code  to our application
require('./db/conn');

// This line defines a constant static_path, which is the absolute path to the "public/css" directory. __dirname is a Node.js variable that represents the current directory's path, and path.join is used to concatenate and normalize the path.
const static_path = path.join(__dirname, '../public/css');
const templates_path = path.join(__dirname, '../templates/views');
const partials = path.join(__dirname, '../templates/partials');

//This line tells Express to serve static files (like CSS files) from the "public/css" directory. When a client (browser) requests a file, Express will look for it in this directory and serve it if found.
app.use(express.static(static_path));
app.use(express.static(templates_path));

//This line sets the view engine of the Express app to Handlebars (hbs). This means that your templates will use the Handlebars syntax for dynamic content.
app.set('view engine', 'hbs');

//This line sets the directory where your views (templates) are located to the "templates/views" directory.
app.set('views', templates_path);

//This line registers Handlebars partials from the "templates/partials" directory. Partials are smaller, reusable components in Handlebars.
hbs.registerPartials(partials);

//The code allows Express.js to handle form data submissions in a simple format.
//Using this middleware instead postman
app.use(express.urlencoded({ extended: false }));

//Rendering index file on localhost
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

//create a new user in our database
app.post('/signup', async (req, res) => {
  try {
    const regData = new Register({
      userName: req.body.signupUsername,
      email: req.body.signupEmail,
      password: req.body.signupPassword,
    });
    const registered = await regData.save();
    res.status(201).render('index');
  } catch (err) {
    res.status(400).send('Error');
  }
});

//User login authentication
app.post('/login', async (req, res) => {
  try {
    const userName = req.body.loginUsername;
    const password = req.body.loginPassword;
    const userEmail = await Register.findOne({ userName: userName });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    if (isMatch) {
      res.status(201).render('index');
    } else {
      res.send('Invalid Login details');
    }
  } catch (err) {
    res.status(400).send('Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
