import { setSemesterFromMainPage } from './api';

export const SET_SEMESTER = Symbol('SET_SEMESTER');
export function setSemester({ career, term }) {
  return {
    type: SET_SEMESTER,
    career,
    term,
  };
}

export const SET_SEMESTER_CHOICES = Symbol('SET_SEMESTER_CHOICES');
export function setSemesterChoices({ choices }) {
  return {
    type: SET_SEMESTER_CHOICES,
    choices,
  };
}

export const CHANGED_SEMESTER = Symbol('CHANGED_SEMESTER');
export function changedSemester({ term }) {
  return (dispatch) => {
    // dispatch(setSemester({ term, career: 'Undergraduate' }));
    dispatch(setSemesterFromMainPage({ term }));
  };
}
