const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const User = require('../models/user');
const passport = require('passport'); // Import passport for login


router.get('/', (req, res) => {
    const message = req.flash('error');
    res.render('signup', { message: message, navbar: res.locals.navbar }); 
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Basic input validation
    if (!username || !password || password.length < 6) {
        req.flash('error', 'Invalid username or password (must be at least 6 characters)');
        return res.redirect('/signup');
    }

    try {
        // Check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error', 'Username already taken');
            return res.redirect('/signup');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); 

        // Create new user and save to database
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        // Automatically log in the new user and redirect
        req.login(newUser, (err) => {
            if (err) { 
                console.error("Error logging in after signup:", err);
                return res.redirect('/login');  // Redirect to login on error
            } else {
                // Successful signup and login, redirect to index (or mypage)
                return res.redirect('/mypage'); // You can change this to '/mypage' if you prefer
            }
        }); 
       
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
