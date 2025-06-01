const express = require("express")
const app = express()

const path = require('path')
const cors = require("cors")
const dbConnect = require("./db/dbConnect")
const UserRouter = require("./routes/UserRouter")
const PhotoRouter = require("./routes/PhotoRouter")
const CommentRouter = require("./routes/CommentRouter")
const AuthRouter = require("./routes/AuthRouter")
const cookieParser = require('cookie-parser')
app.use(cookieParser())

dbConnect()

require('dotenv').config

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : []


app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use(express.json())

app.use("/user", UserRouter)
app.use("/photo", PhotoRouter)
app.use("/admin", AuthRouter)
app.use("/comment", CommentRouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" })
})

app.listen(8081, () => {
  console.log("server listening on port 8081")
})
