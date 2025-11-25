import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

// Get all assignments for a course
export async function findAssignmentsForCourse(cid) {
  return await model.find({ course: cid });
}

// Get single assignment by ID
export async function findAssignmentById(aid) {
  return await model.findById(aid);
}

// Create assignment for a course
export async function createAssignmentForCourse(cid, assignment) {
  const newAssignment = {
    ...assignment,
    _id: uuidv4(),
    course: cid,
  };
  return await model.create(newAssignment);
}

// Update assignment
export async function updateAssignment(aid, updates) {
  return await model.findByIdAndUpdate(aid, updates, { new: true });
}

// Delete assignment
export async function deleteAssignment(aid) {
  return await model.findByIdAndDelete(aid);
}
