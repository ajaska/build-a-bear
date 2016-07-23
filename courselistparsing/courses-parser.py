from collections import namedtuple
import sys
import json

sys.setrecursionlimit(15000)

# Course = namedtuple('Course', ['ccn', 'dept', 'dept_number', 'section', 'type', 'title', 'units', 'room', 'days', 'start', 'end', 'instructors'])
Course = namedtuple('Course', ['ccn', 'dept', 'dept_number', 'section', 'type', 'title']) 

buildings = """
Barrows
Latimer
Valley
Dwinelle
Kroeber
Davis
Cory
Etcheverry
Hildebrand
Tolman
O'Brien
Jacobs Hall
Donner Lab
McCone
Li Ka Shing
Hearst Field Annex
Hearst Gym
Barker
Campbell
Stanley
Wurster
Evans
Hearst Mining
Tan 180
Giannini
Mulford
Moffitt Library
Unit 1
Unit 2
Genetics & Plant Bio
Sutardja Dai
Morgan
Jacobs Hall
Jacobs
Life Sciences Addition
Haviland
LeConte
Blum B100AB
Wellman
W 09:00
W 11:00
Cheit C
Haas Faculty Wing
Haas Pavilion
RSF Spieker Aquatics
Morrison
Hesse 45
Hesse 30
Hesse 70
Hesse 122
""".split("\n")[1:-1]

courses = set()
with open('courses-raw.txt') as f:
    i = 0
    while True:
        line = f.readline()
        if not line:
            break
        if not line.startswith('(MTWRFSU)'):
            continue
        line = line.strip()
        line_courses = line.split('2016 Fall')
        for line_course in line_courses[1:]:
            line_course = line_course.strip()
            line_course = line_course.split(' ', 5)
            remainder = line_course[5]

            remainder = remainder.split('0.00')[0]
            remainder = remainder.split('0.50')[0]
            remainder = remainder.split('1.00')[0]
            remainder = remainder.split('2.00')[0]
            remainder = remainder.split('3.00')[0]
            remainder = remainder.split('4.00')[0]
            remainder = remainder.split('5.00')[0]
            remainder = remainder.split('6.00')[0]
            remainder = remainder.split('6.50')[0]
            remainder = remainder.split('10.50')[0]
            remainder = remainder.split('00:00')[0]
            remainder = remainder.split('M 12:00')[0]
            remainder = remainder.split('TR 12:00')[0]
            remainder = remainder.split('T 15:00')[0]
            for building in buildings:
                remainder = remainder.split(building)[0]

            remainder = remainder.strip()

            courses.add(Course(
                line_course[0],
                line_course[1],
                line_course[2],
                line_course[3],
                line_course[4],
                remainder
            ))
        i += 1
courses = list(courses)

# This is horrifically inefficient
def filter_discussions(course):
    if course.type != 'DIS':
        return True
    possible_lecs = len(list(filter(lambda x: x.dept == course.dept and x.dept_number == course.dept_number and x.type == 'LEC', courses))) > 0
    if possible_lecs:
        return False
    return True
    
courses = sorted(courses, key=lambda x: x.ccn)
print(courses)
courses = list(filter(filter_discussions, courses))
print(courses)
depts = sorted(list(set(course.dept for course in courses)))
with open('depts.json', 'w') as f:
    json.dump(depts, f, separators=(',',':'))

dept_indexed = {dept: {} for dept in depts}
for course in courses:
    dept_indexed[course.dept][course.dept_number] = int(course.ccn)

with open('dept_indexed.json', 'w') as f:
    json.dump(dept_indexed, f, separators=(',',':'))

ccn_indexed = {int(course.ccn): course[1:] for course in courses}
with open('ccn_indexed.json', 'w') as f:
    json.dump(ccn_indexed, f, separators=(',',':'))
