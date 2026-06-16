const mongoose = require("mongoose");
const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    leaveType: {
        type: String,
        enum: ["Sick Leave", "Casual Leave", "Paid Leave"],
        required: true
    }
});
module.exports = mongoose.model("Leave", leaveSchema);