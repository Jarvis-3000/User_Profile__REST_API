import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

dotenv.config()

//to create a user document
const createUser = async (req, res) => {
    try {
        //Checking the existence of the user
        const isUser = await User.findOne({ email: req.body.email })
        if (isUser) {
            return res.status(201).json({
                message: "User Exists"
            })
        }

        //crating a new user
        const user = new User(req.body)
        
        if(req.body.key==process.env.admin_key){
            user.isAdmin=true
        }

        await user.save()
        res.status(201).json(user)
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ error: err.message })
    }
}

//to get all the users documents
const getAllUsers = async (req, res) => {
    try {

        const isAdmin=req.user.isAdmin
        console.log("isAdmin",isAdmin)

        if(isAdmin) {
            const users = await User.find({})
            console.log(users)
            return res.status(200).json(users)
        }
        throw new Error()
            
    }
    catch (err) {
        // console.log(err)
        res.status(400).json({error:"Not Authorized"})
    }
}

//to get a specific user document
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                message: "User Does Not Exist"
            })
        }
        console.log(user)
        res.status(200).json(user)
    }
    catch (err) {
        // console.log(err)
        res.status(400).send(err)
    }
}

//to update a user document
const updateUser = async (req, res) => {
    try {
        //used my own method to update and keep .pre middleware running properly

        // const user = await User.findOne({ email: req.body.email })

        //we used auth middleware
        for (var prop in req.body) {
            req.user[prop] = req.body[prop]
        }

        //to save updated user
        const updatedUser = new User(req.user)
        await updatedUser.save()

        //to check user existence
        // if (!user) {
        //     return res.status(404).json({
        //         message: "User Does Not Exist"
        //     })
        // }

        res.status(201).json(updatedUser)
    }
    catch (err) {
        res.status(400).send(err)
    }
}

//to delete a user document
const deleteUser = async (req, res) => {
    try {
        // const user = await User.findOneAndDelete({ email: req.body.email })
        // if (!user) {
        //     return res.status(404).json({
        //         message: "User Does Not Exist"
        //     })
        // }
        
        //since we are already authorized by auth middleware
        await req.user.remove()
        res.status(201).json({ message: "User Successfully Deleted" })
    }
    catch (err) {
        res.status(400).send(err)
    }
}



const loginUser = async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email })

        //to verify the password
        if (user) {
            const isPassCorrect = await bcrypt.compare(req.body.password, user.password)
            console.log(req.body.password, " ", user.password)

            console.log("pass correct in login1 ")

            if (isPassCorrect) {
                const token = await user.generateAuthToken()
                console.log("pass correct in login2")
                return res.status(201).json({ user, token })
            }

            return res.status(404).json({
                message: "Unable pass not correct To login"
            })
        }

        res.status(404).json({
            message: "Unable To login"
        })


    }
    catch (err) {
        res.status(400).json(err)
    }
}

const logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token      //for logout a specific session
        })

        await req.user.save()
        res.send("logout successfully")
    }
    catch (err) {
        res.status(400).send(err)
    }
}

const logoutAllSessions = async (req, res) => {
    try {
        req.user.tokens = []   //for logoutAllSessions

        await req.user.save()
        res.send("logout Successfully")

    }
    catch (err) {
        res.status(400).send(err)
    }
}

export { createUser, getAllUsers, getUser, updateUser, deleteUser, loginUser, logoutUser, logoutAllSessions }