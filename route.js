const express = require('express');
const bodyParser = require('body-parser');

const cors= require('cors'); 
const User = require('./Model/user');
const Video = require('./Model/video')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const auth = require('./verifyToken');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


// For register
router.post("/register", async (req, res, next) => {
    var saltkey = await bcrypt.genSalt(10);
    var hasedPass = await bcrypt.hash(req.body.password, saltkey);
    const user = new User({
        username: req.body.username,
        password: hasedPass
    });
    await user.save();
    res.send({"text":"Registerd Successfully"});
});

// For login User
router.post("/login", async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
        return res.send("User Not Found..!!");
    else {
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid)
            return res.send("Invalid Password Try Again...")
        else {
            const token = await jwt.sign({ _id: user._id }, "privatekey");
            // res.header("Authorization", token);
            res.send({token});
        }
    }
});

// for Video Post
router.post("/video", auth, async (req, res, next) => {
    const video = new Video({
        title: req.body.title,
        desc: req.body.desc,
        posted_by: req.body.posted_by,
        url: req.body.url,
        likes: req.body.likes,
        cat: req.body.cat
    });
    try {
        await video.save();
        res.send({"text":"Video Posted Successfully"});
    } catch (error) {
        var err = JSON.parse('{"errors":[]}');
        for (var key in error.errors)
            switch (key) {
                case "title":
                    err['errors'].push({ "Key": key, "message": error.errors.title.message });
                    break;
                case "desc":
                    err['errors'].push({ "Key": key, "message": error.errors.desc.message });
                    break;
                case "posted_by":
                    err['errors'].push({ "Key": key, "message": error.errors.posted_by.message });
                    break;
                case "url":
                    err['errors'].push({ "Key": key, "message": error.errors.url.message });
                    break;
            }
        res.send({err});
    }
});

router.patch('/video/:id',auth,async(req,res, next)=>{
    try {
        const video =await Video.findOne({_id:req.params.id});
        video.title = req.body.title;
        video.desc = req.body.desc;
        video.posted_by = req.body.posted_by;
        video.url = req.body.url;
        video.likes = req.body.likes;
        video.cat = req.body.cat;
        console.log(req.params.id);
        await video.save();
        res.send(video);
        res.send("record updated.");
    } catch (error) {
        res.status(404).send(error);
    }
});

router.delete('/video/:id', auth, async (req, res, next) => {
    try {
        await Video.deleteOne({ _id: req.params.id });
        res.send("Video Removed");
    } catch (error) {
        res.status(404).send({ error: "Video Not Found" });
    }
});

//get data
router.get("/videos",auth, async (req, res, next) => {
    const video = await Video.find();
    setTimeout(()=>{
        res.send(video);
    },1000);
});
module.exports = router;