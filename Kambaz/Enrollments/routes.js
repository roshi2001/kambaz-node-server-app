import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const findEnrollmentsForUser = (req, res) => {
    const { uid } = req.params;
    const rows = dao.findByUser(uid);
    res.json(rows);
  };

  const enrollInCourse = (req, res) => {
    const { user, course } = req.body || {};
    if (!user || !course) {
      return res.status(400).json({ message: "user and course required" });
    }
    const created = dao.createEnrollment(user, course); // idempotent
    res.status(201).json(created);
  };

  const unenrollById = (req, res) => {
    const { eid } = req.params;
    const ok = dao.deleteById(eid);
    return ok ? res.sendStatus(204) : res.sendStatus(404);
  };

  const unenrollByPair = (req, res) => {
    const { uid, cid } = req.params;
    const ok = dao.deleteByPair(uid, cid);
    return ok ? res.sendStatus(204) : res.sendStatus(404);
  };
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
   const courses = await enrollmentsDao.findCoursesForUser(userId);
   res.json(courses);
 };


  // routes
  app.get("/api/users/:uid/enrollments", findEnrollmentsForUser);
  app.get("/api/users/:uid/courses", findCoursesForEnrolledUser);

  app.post("/api/enrollments", enrollInCourse);
  app.delete("/api/enrollments/:eid", unenrollById);
  app.delete("/api/users/:uid/courses/:cid/enrollment", unenrollByPair);
}
