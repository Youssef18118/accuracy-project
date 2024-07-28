// routes/about.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('about', { navbar: res.locals.navbar }); 
});
module.exports = router;