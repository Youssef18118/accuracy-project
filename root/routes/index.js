const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('index', { navbar: res.locals.navbar }); // Use 'render' to render the index.ejs file
});
module.exports = router;
