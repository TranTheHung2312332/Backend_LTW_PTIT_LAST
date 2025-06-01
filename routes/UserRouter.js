const express = require("express")
const User = require("../db/userModel")
const router = express.Router()

const AuthFilter = require("../middlewares/AuthFilter")
const BypassAuthFilter = require("../middlewares/BypassAuthFilter")

const jwtSignAndResponse = require('../helpers/jwtSignAndResponse')

// Public
router.post("/", BypassAuthFilter, async (req, res) => {
    const {
        firstName,
        lastName,
        location,
        description,
        occupation,
        loginName,
        password,
    } = req.body

    const existedUser = await User.findOne({login_name: loginName})
    let error = null
    if(existedUser){
        error = "login name has been used"
    }
    else if(!firstName || !lastName || !loginName || !password){
        error = "first name, last name, login name, password is required"
    }
    if(error){
        return res.status(400).json({
                    message: "failed",
                    error
                })
    }

    const user = new User({
        first_name: firstName,
        last_name: lastName,
        location,
        description,
        occupation,
        login_name: loginName,
        password
    })
    await user.save()

    jwtSignAndResponse(user._id, res)

})


// Protected
router.use(AuthFilter)

router.get("/list", async (req, res) => {
    const list = await User.find({}, '_id first_name last_name')

    res.status(200).json({
        message: "ok",
        data: list
    })
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({_id: id})

    if(user){
        res.status(200).json({
            message: "ok",
            data: user
        })
    }
    else {
        res.status(400).json({
            message: "failed",
            error: "invalid id"
        })
    }
})

module.exports = router