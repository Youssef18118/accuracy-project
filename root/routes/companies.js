const express = require('express');
const router = express.Router();
const Analyst = require('../models/analyst');
const CompanyMapping = require('../models/companyMappingModel');

router.get('/', async (req, res) => {
    try {
        const companies = await CompanyMapping.distinct('companyName');

        res.render('companies', { companies: companies });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:companyName', async (req, res) => {
    const companyName = decodeURIComponent(req.params.companyName);

    try {
        const company = await CompanyMapping.findOne({ companyName });
        if (!company) {
            return res.status(404).send('Company not found');
        }

        // Find analysts associated with this company
        const analysts = await Analyst.find({ target_company: companyName });

        console.log(analysts); // Check if you are getting analyst data

        res.render('company', { company, analysts });
    } catch (error) {
        console.error(`Error fetching details for ${companyName}:`, error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
