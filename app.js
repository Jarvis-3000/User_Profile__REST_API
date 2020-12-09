import express from "express"
import userRoutes from "./router/userRouters.js"
import connectDB from "./config/db.js"
import bcrypt from "bcrypt"

const app=express()

connectDB()

app.use(express.json())
app.use('/',userRoutes)

app.listen(3000)