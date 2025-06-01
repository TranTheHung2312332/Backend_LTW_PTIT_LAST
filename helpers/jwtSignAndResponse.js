const jwt = require('jsonwebtoken')

require('dotenv').config()

const ACCESS_KEY = process.env.ACCESS_KEY
const REFRESH_KEY = process.env.REFRESH_KEY
const EXPIRED_TIME_ACCESS = process.env.EXPIRED_TIME_ACCESS
const EXPIRED_TIME_REFRESH = process.env.EXPIRED_TIME_REFRESH

const jwtSignAndResponse = (userId, res) => {

    const accessToken = jwt.sign(
        {userId},
        ACCESS_KEY,
        {expiresIn: EXPIRED_TIME_ACCESS}
    )

    const refreshToken = jwt.sign(
        {userId},
        REFRESH_KEY,
        {expiresIn: EXPIRED_TIME_REFRESH}
    )

    res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: Number(EXPIRED_TIME_REFRESH.slice(0, -1)) * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: 'lax'
        })
        .status(200)
        .json({
            data: {
                token: accessToken,
                userId
            },
            message: "ok"
        })

}

module.exports = jwtSignAndResponse

