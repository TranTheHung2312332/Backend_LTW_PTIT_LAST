const express = require("express")
const Photo = require("../db/photoModel")
const User = require("../db/userModel")
const router = express.Router()

const Upload = require('../middlewares/Upload')
const AuthFilter = require('../middlewares/AuthFilter')

router.use(AuthFilter)

router.get("/photosOfUser/:id", async (req, res) => {
    const userId = req.params.id
    const photos = await Photo.find({user_id: userId}, '_id user_id file_name date_time comments').lean()

    if(!photos){
        return res.status(400).json({
            message: "failed",
            error: "Error when tried to find photos of user"
        })
    }

    for(const photo of photos){
        for(const comment of photo.comments){
            const user = await User.findOne({_id: comment.user_id})
            comment.user = {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name
            }
        }
        photo.comments = photo.comments.map(item => ({
            comment: item.comment,
            date_time: item.date_time,
            _id: item._id,
            user: item.user
        }))
        photo.user = await User.findById(userId, '_id first_name last_name').lean()
        delete photo.user_id
    }        

    res.status(200).json({
        message: "ok",
        data: photos
    })
})

router.post('/new', Upload.single('photo'), async (req, res) => {    
    if(!req.file){
        return res.status(400).json({
            message: "failed",
            error: "No file uploaded"
        })
    }

    req.file.filename = 'uploads/' + req.file.filename

    const photo = new Photo({
        file_name: req.file.filename,
        date_time: req.body.dateTime || new Date(),
        user_id: req.user._id,
        comments: []
    })
    await photo.save()

    res.status(200).json({
        message: "ok",
        data: {
            _id: photo._id,
            file_name: photo.file_name,
            date_time: photo.date_time,
            user: {
                _id: req.user._id,
                first_name: req.user.first_name,
                last_name: req.user.last_name
            },
            comments: photo.comments
        }
    })
})

module.exports = router
