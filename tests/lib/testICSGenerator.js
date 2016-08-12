import assert from 'assert';

import { Course, Lecture, Section } from '../../app/models/models';
import { coursesToCal } from '../../app/lib/ICSGenerator';

const fakeLecture = new Lecture({
  ccn: '12345',
  dept: 'TEST',
  deptNumber: '1A',
  section: '103',
  type: 'Lecture',
  desc: 'Test Course for Science',
  room: '??? Dwinelle',
  time: 'MWF 9:00 - 9:59',
  instructor: 'Dr. Professor',
  enrollmentStatus: 'Enrolled',
});

const fakeSection = new Section({
  ccn: '12346',
  dept: 'TEST',
  deptNumber: '1A',
  section: '203',
  type: 'Discussion',
  desc: 'Test Course for Science',
  room: '65 Etcheverry',
  time: 'TuTh 3:29PM - 5:59PM',
  instructor: 'Assistant to Dr. Professor',
  enrollmentStatus: 'Enrolled',
});

const fakeCourse = new Course({
  lecture: fakeLecture,
  sections: [fakeSection],
});

describe('ICSGenerator', function() {
  describe('#coursesToCal()', function() {
    it('Works', function() {
      assert(coursesToCal([fakeCourse]));
    });
  });
});
