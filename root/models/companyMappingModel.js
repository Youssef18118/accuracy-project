const mongoose = require('mongoose');

const companyMappingSchema = new mongoose.Schema({
    companyName: { type: String, required: true, unique: true },
    description: { type: String, required: true }
    // Add other fields as needed (e.g., industry, market cap, etc.)
});

const CompanyMapping = mongoose.model('CompanyMapping', companyMappingSchema, 'companyMappings'); // Specify collection name explicitly

module.exports = CompanyMapping;
