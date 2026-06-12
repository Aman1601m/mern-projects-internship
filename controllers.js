const User = require("./user");
const jwt = require("jsonwebtoken");
const generateToken = (id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET || "secretkey",
        {
            expiresIn:"30d"
        }
    );

};
exports.registerUser = async(req,res)=>{
    const {
        username,
        email,
        password
    } = req.body;
    try{
        const existingUser =
        await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }
        const user =
        await User.create({
            username,
            email,
            password
        });
        res.status(201).json({
            message:"User registered successfully",
            token:generateToken(user._id)
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });

    }

};
exports.loginUser = async(req,res)=>{
    const {
        email,
        password
    }=req.body;
    try{
        const user =
        await User.findOne({email})
        .select("+password");
        if(user &&
            await user.matchPassword(password)
        ){
            res.json({
                message:"Login successful",
                token:generateToken(user._id)
            });
        }
        else{
            res.status(401).json({
                message:"Invalid email or password"
            });
        }
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};