export const SET_ENROLLED_COURSES = Symbol('SET_ENROLLED_COURSES');

export function setEnrolledCourses({courses}) {
  return {
    type: SET_ENROLLED_COURSES,
    courses: courses
  }
}
