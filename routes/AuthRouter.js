const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const User = require("../db/userModel")
const cookieParser = require('cookie-parser')

require('dotenv').config()

const ACCESS_KEY = process.env.ACCESS_KEY
const REFRESH_KEY = process.env.REFRESH_KEY
const EXPIRED_TIME_ACCESS = process.env.EXPIRED_TIME_ACCESS

const jwtSignAndResponse = require('../helpers/jwtSignAndResponse')

router.post('/login', async (req, res) => {
    const { loginName, password } = req.body

    const user = await User.findOne({login_name: loginName, password})

    if(!user){
        return res.status(400)
                    .json({message: "failed", error: "login name or password is wrong"})
    }

    jwtSignAndResponse(user._id, res)

})

router.get("/logout", async (req, res) => {
    const accessToken = req.headers['authorization']

    if(!accessToken){
        return res.status(400)
                    .json({
                        message: "failed",
                        error: "Unauthorized"
                    })
    }


    jwt.verify(accessToken.split(' ')[1], ACCESS_KEY, (err, decoded) => {
        if(err){
            res.status(400).json({
                message: "failed",
                error: err.message
            })
        }

        else{
            res
                .clearCookie('refreshToken')
                .status(200)
                .json({
                    message: "ok"
                })
        }
    })
})

router.get('/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken    

    console.log(req.cookies);
    

    jwt.verify(refreshToken, REFRESH_KEY, (err, decoded) => {
        if(err){
            res.status(400).json({
                message: "failed",
                error: err.message
            })
        }

        else{
            const accessToken = jwt.sign(
                {userId: decoded.userId},
                ACCESS_KEY,
                {expiresIn: EXPIRED_TIME_ACCESS}
            )

            res.status(200).json({
                message: "ok",
                data: accessToken
            })
        }
    })
})

module.exports = router