const express = require('express');
const router = express.Router();
const Analyst = require('../models/analyst');

router.get('/', async (req, res) => {
    try {
        const leaderboardData = await Analyst.find({}).sort({total_score: -1}); 

        // Data formatting
        const formattedData = leaderboardData.map(analyst => ({
            _id: analyst._id.toString(), 
            name: analyst.name,
            organization: analyst.organization,
            prediction_date: analyst.prediction_date.toISOString().split('T')[0],
            current_price: analyst.current_price.toString(),
            percent_diff: analyst.percent_diff.toString(),
            prediction_price: analyst.prediction_price.toString(),
            total_score: analyst.total_score.toString(),
            target_company: analyst.target_company,
          }));

        // console.log('Formatted Data:', formattedData);

        res.render('leaderboard', { leaderboardData: JSON.stringify(formattedData) }); 
    } catch (error) {
         console.error('Error in leaderboard route:', error);  // Log the specific error
         res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
