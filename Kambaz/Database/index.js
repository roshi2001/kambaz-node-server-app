import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import enrollments from "./enrollments.js";

import usersModel from "../Users/model.js";

export default {
  courses,
  modules,
  assignments,
  users: usersModel,     
  enrollments
};
