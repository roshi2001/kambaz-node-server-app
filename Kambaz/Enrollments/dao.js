import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function EnrollmentsDao() {
  
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  async function findByUser(userId) {
    return await model.find({ user: userId });
  }


  function createEnrollment(userId, courseId) {
    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  }

  function deleteByPair(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }


  async function deleteById(enrollmentId) {
    const result = await model.deleteOne({ _id: enrollmentId });
    return result.deletedCount > 0;
  }

  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    findByUser,             
    createEnrollment,  
    enrollUserInCourse: createEnrollment,      
    deleteByPair,            
    deleteById,              
    unenrollAllUsersFromCourse,
    unenrollUserFromCourse: deleteByPair 
  }
}