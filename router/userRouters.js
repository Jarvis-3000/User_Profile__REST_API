import express from "express"
import auth from "../middlewares/auth.js"
import {createUser,getAllUsers,getUser,updateUser,deleteUser,loginUser,logoutUser,logoutAllSessions} from "../controllers/userController.js"
const router=express.Router()



router.post("/register",createUser)
router.post("/getUser",getUser)
router.post("/login",loginUser)

//After login JWT
router.get("/userMe",auth,(req,res)=>{
    res.status(201).json({user:req.user,message:"User Profile!!!"})
})

router.get("/logout",auth,logoutUser)
router.get("/logoutAll",auth,logoutAllSessions)

router.get("/getAllUsers",auth,getAllUsers)

router.patch("/updateUser",auth,updateUser)

router.delete("/deleteUser",auth,deleteUser)

router.get("*",(req,res)=>{
    res.status(404).send("Page Not Found")
})
export default router