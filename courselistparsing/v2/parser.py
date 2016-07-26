from collections import namedtuple
import sys
import json
import re

Course = namedtuple('Course', ['ccn', 'dept', 'dept_number', 'section', 'type', 'units', 'title', 'room', 'days', 'start', 'end', 'instructor',])

courses = []
with open('schedule.json') as json_file:
    json_data = json.load(json_file)
    for course in json_data['data']:
        courses.append(Course(
            *course[1:]
        ))

dept_mappings = {}
with open('dept_mappings.json') as json_file:
    json_data = json.load(json_file)
    for dept in json_data:
        dept_mappings[dept['name']] = dept['code']

courses = list(courses)

lectures = set()
for course in courses:
    if course.type == 'LEC':
        lectures.add((course.dept, course.dept_number))

def filter_discussions(course):
    if course.type not in ('LAB', 'DIS'):
        return True
    if (course.dept, course.dept_number) in lectures:
        return False
    return True
    
courses = sorted(courses, key=lambda x: x.ccn)

courses = list(filter(filter_discussions, courses))

depts = list(set(course.dept for course in courses))
depts_dict = {dept: dept for dept in depts}
for dept_long, dept_code in dept_mappings.items():
    if dept_code in depts:
        depts_dict[dept_long] = dept_code
    
with open('depts.json', 'w') as f:
    json.dump(depts_dict, f, separators=(',',':'))

dept_indexed = {dept: {} for dept in depts}
for course in courses:
    if dept_indexed[course.dept].get(course.dept_number) is None:
        dept_indexed[course.dept][course.dept_number] = []
    if int(course.ccn) not in dept_indexed[course.dept][course.dept_number]:
        dept_indexed[course.dept][course.dept_number].append(int(course.ccn))

with open('dept_indexed.json', 'w') as f:
    json.dump(dept_indexed, f, separators=(',',':'))

ccn_indexed = {int(course.ccn): course[1:] for course in courses}
with open('ccn_indexed.json', 'w') as f:
    json.dump(ccn_indexed, f, separators=(',',':'))
