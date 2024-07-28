const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    const message = req.flash('error'); // Get any error messages from flash
    res.render('login', { message: message, navbar: res.locals.navbar }); 
});

// Login Route (POST)
router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => { // Custom callback for successful authentication
    req.locals.navbar.isAuthenticated = true; // Set isAuthenticated in session
    req.locals.navbar.currentUser = req.user;        // Store user object in session
    res.redirect('/');
});

module.exports = router; 