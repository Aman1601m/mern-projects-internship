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
exports.getProfile = async (req, res) => {
    try {

        res.status(200).json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const Leave = require("./leave");
exports.applyLeave = async (req, res) => {
    try {
        const {
            leaveType,
            startDate,
            endDate,
            reason
        } = req.body;
        const leave = await Leave.create({
            employee: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason
        });
        res.status(201).json(leave)({
            message: "Leave Applied Successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};