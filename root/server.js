const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 8080;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');
const Analyst = require('./models/analyst'); 


// MongoDB Connection String (Consolidated)
const mongoURI = 'mongodb+srv://younghoonlee1205:CTlaC19s4EG85U3U@cluster0.pavy6az.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB (Once)
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Configure sessions
app.use(session({
    secret: 'your_session_secret', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoURI, collectionName: 'sessions' }) 
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Middleware for navbar data
app.use((req, res, next) => {
    res.locals.navbar = { 
      isAuthenticated: req.isAuthenticated(), 
      currentUser: req.user 
    };
    next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Import route handlers 
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const leaderboardRouter = require('./routes/leaderboard');
const companiesRouter = require('./routes/companies');
const loginRouter = require('./routes/login'); 
const logoutRouter = require('./routes/logout');
const signupRouter = require('./routes/signup');



// Use the route handlers
app.use('/', indexRouter);
app.use('/leaderboard', leaderboardRouter); 
app.use('/companies', companiesRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/about', aboutRouter);
app.use('/signup', signupRouter);

// My Page Route (accessible only to authenticated users)
app.get('/mypage', (req, res) => {
    if (req.isAuthenticated()) { // Use req.isAuthenticated()
      res.render('mypage', { navbar: res.locals.navbar, user: req.user }); // Use req.user
    } else {
      res.redirect('/login'); 
    }
});

// Analyst Route Handler (Moved to server.js)
app.get('/analyst/:analystId', async (req, res) => {  
    try {
      const analystId = req.params.analystId;
      console.log('Analyst ID:', analystId); // Log to confirm

      const analyst = await Analyst.findById(analystId);
      
      if (!analyst) {
        return res.status(404).send('Analyst not found');
      }

      res.render('analyst', { analyst: analyst });
    } catch (error) {
      console.error('Error fetching analyst details:', error);
      res.status(500).send('Internal Server Error');
    }
  });



// Passport configuration (Local Strategy)
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
      const user = await User.findOne({ username });
      if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) { return done(null, false, { message: 'Incorrect password.' }); }
      return done(null, user);
  } catch (err) {
      return done(err);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
