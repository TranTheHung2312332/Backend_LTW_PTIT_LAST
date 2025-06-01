const jwt = require('jsonwebtoken')

require('dotenv').config()

const ACCESS_KEY = process.env.ACCESS_KEY

const User = require('../db/userModel')

const AuthFilter = (req, res, next) => {
    if(req.bypassAuth){
        return next()
    }

    const accessToken = req.headers['authorization']

    if(!accessToken){
        return res.status(401).json({
            message: "failed",
            error: "Unauthorized"
        })
    }

    jwt.verify(accessToken.split(' ')[1], ACCESS_KEY, async (err, decoded) => {
        if(err){
            return res.status(401).json({
                message: "failed",
                error: "Unauthorized"
            })
        }
        
        const user = await User.findById(decoded.userId).lean()
        if(!user){
            return res.status(401).json({
                message: "failed",
                error: "Invalid userId"
            })
        }
        else {
            req.user = user
            next()
        }
    })

}

module.exports = AuthFilter