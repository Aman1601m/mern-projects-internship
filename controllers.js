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
    console.log("REGISTER API HIT");

    const {
        username,
        email,
        password
    } = req.body;

    try{
        console.log("Checking existing user...");

        const existingUser =
        await User.findOne({email});

        console.log("Existing user:", existingUser);

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        console.log("Creating user...");

        const user =
        await User.create({
            username,
            email,
            password
        });

        console.log("User created:", user._id);

        res.status(201).json({
            message:"User registered successfully",
            token:generateToken(user._id)
        });
    }
    catch(error){
        console.log("REGISTER ERROR:", error);

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
        res.status(201).json({
            message: "Leave Applied Successfully",
            leave
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({
            employee: req.user._id
        });

        res.status(200).json(leaves);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.approveLeave = async (req, res) => {
    try {

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave not found"
            });
        }

        leave.status = "Approved";

        await leave.save();

        res.status(200).json({
            message: "Leave Approved",
            leave
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.rejectLeave = async (req, res) => {
    try {

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave not found"
            });
        }

        leave.status = "Rejected";

        await leave.save();

        res.status(200).json({
            message: "Leave Rejected",
            leave
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.getAllLeaves = async (req, res) => {
    try{
        const leaves = await Leave.find()
        .populate("employee", "username email");
        res.status(200).json(leaves);
    }
    catch (error){
        res.status(500).json({
            message: error.message
        });
    }
};
exports.getLeaveStats = async (req, res) => {
    try{
        const totalLeaves = 
        await Leave.countDocuments();
        const approvedLeaves =
        await Leave.countDocuments({
            status: "Approved"
        });
        const rejectedLeaves = 
        await Leave.countDocuments({
            status: "Rejected"
        });
        const pendingLeaves =
        await Leave.countDocuments({
            status: "Pending"
        });
        res.status(200).json({
            totalLeaves,
            approvedLeaves,
            rejectedLeaves,
            pendingLeaves
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};