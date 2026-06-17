import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true, 
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,   
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 0, 
    },

    role: {
        type: String,
        enum: ["employee", "hr_manager", "admin"],
        default: "employee",
    },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;