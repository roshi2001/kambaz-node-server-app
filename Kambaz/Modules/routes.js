import ModulesDao from "../Modules/dao.js";
export default function ModulesRoutes(app) {
  const dao = ModulesDao();
  const findModulesForCourse = async (req, res) => {
    const { cid } = req.params;
    const modules = await dao.findModulesForCourse(cid);
    res.json(modules);
  }
    const createModuleForCourse = async (req, res) => {
    const { cid } = req.params;
    const module = {
      ...req.body,
    };
    const newModule = await dao.createModule(cid, module);
    res.send(newModule);
  }
  const deleteModule = async (req, res) => {
  const { cid, moduleId } = req.params;
  const status = await dao.deleteModule(cid, moduleId);
  res.send(status);
}
const updateModule = async (req, res) => {
  const {cid, moduleId } = req.params;
  const moduleUpdates = req.body;
  const status = await dao.updateModule(cid, moduleId, moduleUpdates);
  res.send(status);
}
app.put("/api/courses/:cid/modules/:moduleId", updateModule);
app.delete("/api/courses/:cid/modules/:moduleId", deleteModule);

  app.post("/api/courses/:cid/modules", createModuleForCourse);
  app.get("/api/courses/:cid/modules", findModulesForCourse);
}
