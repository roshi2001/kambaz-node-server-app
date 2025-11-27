import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };
  app.get("/api/courses", findAllCourses);

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  const createCourse = async (req, res) => {
  try {  
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) { 
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const newCourse = await dao.createCourse(req.body);

    if (currentUser.role === "FACULTY") { 
      await enrollmentsDao.enrollUserInCourse(
        currentUser._id,
        newCourse._id
      );
    }

    res.json(newCourse);
  } catch (error) {  
    console.error("Create course error:", error);
    res.status(500).json({ message: "Failed to create course", error: error.message });
  }
};
  app.post("/api/users/current/courses", createCourse);

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };
  app.delete("/api/courses/:courseId", deleteCourse);

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };
  app.put("/api/courses/:courseId", updateCourse);

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };

  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };
  app.get("/api/courses/:cid/users", findUsersForCourse);
}