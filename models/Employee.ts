import mongoose from "mongoose";
import mongooseFieldEncryption from "mongoose-field-encryption";
const { fieldEncryption } = mongooseFieldEncryption;

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
    designation: {
      type: String,
      default: "Employee",
    },
    salary: {
      type: Number,
    },
    profileImage: {
      type: String,
      default: "",
    },
    bankAccountNumber: {
      type: String,
      default: "",
    },
    ssn: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

employeeSchema.plugin(fieldEncryption, {
  fields: ["bankAccountNumber", "ssn"],
  secret: process.env.ENCRYPTION_SECRET || "supersecretkey12345678901234567890",
});

export default mongoose.model("Employee", employeeSchema);