import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(cid) {
    const { assignments } = db;
    return assignments.filter((a) => a.course === cid);
  }

  function findAssignmentById(aid) {
    const { assignments } = db;
    return assignments.find((a) => a._id === aid);
  }

  function createAssignmentForCourse(cid, assignment) {
    const newAssignment = { ...assignment, _id: uuidv4(), course: cid };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function updateAssignment(aid, updates) {
    const { assignments } = db;
    const existing = assignments.find((a) => a._id === aid);
    if (!existing) return null;
    Object.assign(existing, updates);
    return existing;
  }

  function deleteAssignment(aid) {
    const { assignments } = db;
    db.assignments = assignments.filter((a) => a._id !== aid);
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignmentForCourse,
    updateAssignment,
    deleteAssignment,
  };
}
