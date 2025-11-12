import ModulesDao from "../Modules/dao.js";
export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);
  const findModulesForCourse = (req, res) => {
    const { cid } = req.params;
    const modules = dao.findModulesForCourse(cid);
    res.json(modules);
  }
    const createModuleForCourse = (req, res) => {
    const { cid } = req.params;
    const module = {
      ...req.body,
      course: cid,
    };
    const newModule = dao.createModule(module);
    res.send(newModule);
  }
  const deleteModule = (req, res) => {
  const { moduleId } = req.params;
  const status = dao.deleteModule(moduleId);
  res.send(status);
}
const updateModule = async (req, res) => {
  const { moduleId } = req.params;
  const moduleUpdates = req.body;
  const status = await dao.updateModule(moduleId, moduleUpdates);
  res.send(status);
}
app.put("/api/modules/:moduleId", updateModule);
app.delete("/api/modules/:moduleId", deleteModule);
  app.post("/api/courses/:cid/modules", createModuleForCourse);
  app.get("/api/courses/:cid/modules", findModulesForCourse);
}
