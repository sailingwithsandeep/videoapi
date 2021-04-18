const mongoose = require('mongoose');
const videoSchema = mongoose.Schema({
    title: { 
        type: String,
        required: [true, 'Video title field is required']
    }, 
    desc: {
        type: String,
        required: [true,'Description field is required']
    },
    posted_by: {
        type: String,
        required: [true, 'Posted By field is required']
    },
    url: {
        type: String,
        required: [true,'URL field is required']
    },
    likes: Number,
    cat: []
}, { timestamps: true });
module.exports = mongoose.model("Video", videoSchema); 