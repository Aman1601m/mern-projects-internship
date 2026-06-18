import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", 
    },
    salary: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);