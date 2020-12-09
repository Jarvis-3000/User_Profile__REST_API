import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[{validator:validator.isEmail,message:"Invalid email"}]
    },
    password:{
        type:String,
        required:true,
        validate:[{validator:validator.isStrongPassword,message:"Weak password"}]
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
},
{
    timestamps:true
}
)

userSchema.methods.generateAuthToken=async function(){
    const user=this

    const token=await jwt.sign({_id:user._id.toString()},process.env.secret_key)
    console.log("token created")
    user.tokens=user.tokens.concat({token})
    await user.save()
    
    return token
}

userSchema.pre('save',async function(){
    const user=this

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
        console.log("pass hashed",user.password)
    }
})

//to create a new User model
const User=mongoose.model('User',userSchema)

export default User