export const SET_SEMESTER = Symbol('SET_SEMESTER');

export function setSemester({ career, term }) {
  return {
    type: SET_SEMESTER,
    career,
    term,
  };
}
