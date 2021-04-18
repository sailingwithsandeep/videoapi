const mongoose = require('mongoose');
const usersSchema = mongoose.Schema({
    username: { 
        type: String,
        required: [true, 'Video username field is required']
    }, 
    password: { 
        type: String,
        required: [true, 'Video password field is required']
    }, 
}, { timestamps: true });
module.exports = mongoose.model("User", usersSchema);