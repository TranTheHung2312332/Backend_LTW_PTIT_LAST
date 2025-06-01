const express = require('express')
const router = express.Router()

const Photo = require('../db/photoModel')

const AuthFilter = require('../middlewares/AuthFilter')
router.use(AuthFilter)


router.post('/commentsOfPhoto/:photo_id', async (req, res) => {
    const photoId = req.params.photo_id
    const user = req.user

    const {comment, dateTime} = req.body

    if(!comment){
        return res.status(400).json({
            message: "failed",
            error: "Comment cannot blank"
        })
    }

    const photo = await Photo.findById(photoId)

    if(!photo){
        return res.status(400).json({
            message: "failed",
            error: "Invalid photoId"
        })
    }

    const newComment = {
        comment,
        date_time: dateTime || new Date(),
    }

    photo.comments.push({...newComment, user_id: user._id})
    await photo.save()

    res.status(200).json({
        message: "ok",
        data: {
            ...newComment,
            user
        }
    })
})


module.exports = router