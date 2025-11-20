import { v4 as uuidv4 } from "uuid";
export async function findCoursesForUser(userId) {
 const enrollments = await model.find({ user: userId }).populate("course");
 return enrollments.map((enrollment) => enrollment.course);
}

export default function EnrollmentsDao(db) {
    function enrollUserInCourse(userId, courseId) {
   return model.create({
     user: userId,
     course: courseId,
     _id: `${userId}-${courseId}`,
   });
 }



  function findByUser(uid) {
    const { enrollments } = db;
    return enrollments.filter(
      (e) => String(e.user) === String(uid)
    );
  }

  function findByUserAndCourse(uid, cid) {
    const { enrollments } = db;
    return enrollments.find(
      (e) => String(e.user) === String(uid) && String(e.course) === String(cid)
    );
  }

  function createEnrollment(user, course) {
    const existing = findByUserAndCourse(user, course);
    if (existing) return existing; // idempotent
    const newE = { _id: uuidv4(), user: String(user), course: String(course) };
    db.enrollments = [...db.enrollments, newE];
    return newE;
  }

  function deleteById(eid) {
    const { enrollments } = db;
    const before = enrollments.length;
    db.enrollments = enrollments.filter((e) => e._id !== eid);
    return db.enrollments.length < before;
  }

  function deleteByPair(uid, cid) {
    const { enrollments } = db;
    const before = enrollments.length;
    db.enrollments = enrollments.filter(
      (e) => !(String(e.user) === String(uid) && String(e.course) === String(cid))
    );
    return db.enrollments.length < before;
  }
   function unenrollAllUsersFromCourse(courseId) {
   return model.deleteMany({ course: courseId });
 }


  return {
    findByUser,
    findByUserAndCourse,
    createEnrollment,
    deleteById,
    deleteByPair,
    enrollUserInCourse,
     unenrollAllUsersFromCourse,
     findCoursesForUser

  };
}
