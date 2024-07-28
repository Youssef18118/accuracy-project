const mongoose = require('mongoose');

const analystSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    name: { type: String, required: true },
    organization: { type: String, required: true },
    prediction_date: { type: Date, required: true },
    current_price: { type: Number, required: true, min: 0 },
    percent_diff: { type: Number, required: true },
    prediction_price: { type: Number, required: true, min: 0 },
    total_score: { type: Number, required: true }, 
    target_company: { type: String, required: true },
});

const Analyst = mongoose.model('Analyst', analystSchema, 'analysts');

module.exports = Analyst; 