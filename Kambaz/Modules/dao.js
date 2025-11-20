import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";
export default function ModulesDao(db) {

 async function findModulesForCourse(cid) {
   const course = await model.findById(cid);
   return course.modules;
 }
 async function createModule(cid, module) {
   const newModule = { ...module, _id: uuidv4() };
   const status = await model.updateOne(
     { _id: cid },
     { $push: { modules: newModule } }
   );

  return newModule;
}
async function deleteModule(cid, moduleId) {
  const status = await model.updateOne(
     { _id: cid },
     { $pull: { modules: { _id: moduleId } } }
   );
   return status;
}
async function updateModule(cid, moduleId, moduleUpdates) {
   const course = await model.findById(cid);
   const module = course.modules.id(moduleId);
   Object.assign(module, moduleUpdates);
   await course.save();
   return module;
}



 return {
   findModulesForCourse, createModule, deleteModule, updateModule
 };
}
