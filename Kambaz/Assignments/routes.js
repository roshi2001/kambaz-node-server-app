// Kambaz/Assignments/routes.js
import * as dao from "./dao.js";

export default function AssignmentsRoutes(app) {

  const findAssignmentsForCourse = async (req, res) => {
    const { cid } = req.params;
    const list = await dao.findAssignmentsForCourse(cid);
    res.json(list);
  };

  const createAssignmentForCourse = async (req, res) => {
    const { cid } = req.params;
    const created = await dao.createAssignmentForCourse(cid, req.body || {});
    res.status(201).json(created);
  };

  const findAssignmentById = async (req, res) => {
    const one = await dao.findAssignmentById(req.params.aid);
    if (!one) return res.sendStatus(404);
    res.json(one);
  };

  const updateAssignment = async (req, res) => {
    const updated = await dao.updateAssignment(req.params.aid, req.body || {});
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  };

  const deleteAssignment = async (req, res) => {
    await dao.deleteAssignment(req.params.aid);
    res.sendStatus(204);
  };

  app.get("/api/courses/:cid/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:cid/assignments", createAssignmentForCourse);
  app.get("/api/assignments/:aid", findAssignmentById);
  app.put("/api/assignments/:aid", updateAssignment);
  app.delete("/api/assignments/:aid", deleteAssignment);
}
