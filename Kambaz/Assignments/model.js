import mongoose from "mongoose";
import AssignmentSchema from "./schema.js";


const AssignmentsModel = mongoose.model("Assignments", AssignmentSchema);
export default AssignmentsModel;