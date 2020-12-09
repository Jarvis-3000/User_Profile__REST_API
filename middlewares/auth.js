import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import dotenv from "dotenv"

dotenv.config()

const auth = async (req, res, next) => {

    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.secret_key)
        
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        
        if (!user){
            throw new Error()
        }
        req.token=token
        req.user=user
        console.log("authorized")
        

        next()
    }
    catch (err) {
        res.status(401).json({error:"Please Authenticate"} )
    }
}

export default auth