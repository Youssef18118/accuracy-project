const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); } // Handle errors during logout
        req.session.destroy((err) => {  // Destroy the session
            if (err) { return next(err); } // Handle errors during session destruction
            res.redirect('/login');      // Redirect to login after logout
        });
    });
});

module.exports = router;