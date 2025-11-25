import mongoose from "mongoose";


const AssignmentSchema = new mongoose.Schema({
_id: { type: String, required: true },
title: String,
description: String,
points: Number,
due: String,
available: String,
course: String
}, { collection: "assignments" });


export default AssignmentSchema;