// Kambaz/Assignments/routes.js
import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = (req, res) => {
    const { cid } = req.params;
    const list = dao.findAssignmentsForCourse(cid);
    res.json(list);
  };

  const createAssignmentForCourse = (req, res) => {
    const { cid } = req.params;
    const created = dao.createAssignmentForCourse(cid, req.body || {});
    res.status(201).json(created);
  };

  const findAssignmentById = (req, res) => {
    const one = dao.findAssignmentById(req.params.aid);
    if (!one) return res.sendStatus(404);
    res.json(one);
  };

  const updateAssignment = (req, res) => {
    const updated = dao.updateAssignment(req.params.aid, req.body || {});
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  };

  const deleteAssignment = (req, res) => {
    dao.deleteAssignment(req.params.aid);
    res.sendStatus(204);
  };

  app.get("/api/courses/:cid/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:cid/assignments", createAssignmentForCourse);
  app.get("/api/assignments/:aid", findAssignmentById);
  app.put("/api/assignments/:aid", updateAssignment);
  app.delete("/api/assignments/:aid", deleteAssignment);
}
