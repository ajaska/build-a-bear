import requests
import json

from departments import depts
from helpers import get_section_info, filter_dept, find_id

ccn_indexed = {}
dept_indexed = {}
dept_mapping = []
depts_manifest = {}

for dept in depts.keys():
    dept = str(dept)
    dept_indexed[dept] = {}

    dept_entry = {}
    dept_entry["name"] = depts[dept]
    dept_entry["code"] = dept
    dept_entry["id"] = find_id(dept)
    if (dept_entry["id"] != ""):
        dept_mapping.append(dept_entry)

    depts_manifest[depts[dept]] = dept

    temp = filter_dept(dept)
    print temp

    base = "https://berkeleyscheduler.com/data/sp17/classes/{}.json"
    url = base.format(temp)

    r = requests.get(url)
    try:
        data = r.json()
    except:
        continue
    course_numbers = data.keys()

    for course_num in course_numbers:
        course_num = str(course_num)
        dept_indexed[dept][course_num] = []

        course_data = data[course_num]
        title = course_data["title"]
        try:
            units = course_data["units"]["value"]["units"]
        except:
            units = ""
        sections = course_data["sections"]

        has_lecture = False
        # All lectures and discussions that don't have a lecture
        for section in sections:
            class_type = section["type"]
            if str(class_type) == "LEC":
                has_lecture = True

        for section in sections:
            class_type = section["type"]
            if has_lecture:
                if class_type == "LEC":
                    CCN = section["id"]
                    section_number = section["number"]
                    dept_indexed[dept][course_num].append(str(CCN))
                    # If there's no information on the section days, location, instructors, start_time, end_time whatsoever
                    if len(section["meetings"]) == 0:
                        continue
                    days, location, instructors, start_time, end_time = get_section_info(section["meetings"][0])
                    entry = [dept, course_num, section_number, class_type, title, units, location, days, start_time, end_time, instructors]
                    # Remove unicode
                    entry = map((lambda x: str(x)), entry)
                    ccn_indexed[str(CCN)] = entry
                    break
                else:
                    continue
            else:
                CCN = section["id"]
                section_number = section["number"]
                dept_indexed[dept][course_num].append(str(section_number))
                # If there's no information on the section days, location, instructors, start_time, end_time whatsoever
                if len(section["meetings"]) == 0:
                    continue
                days, location, instructors, start_time, end_time = get_section_info(section["meetings"][0])
                entry = [dept, course_num, section_number, class_type, title, units, location, days, start_time, end_time, instructors]
                # Remove unicode
                entry = map((lambda x: str(x)), entry)
                ccn_indexed[str(CCN)] = entry
                break

dept_indexed = json.dumps(dept_indexed)
ccn_indexed = json.dumps(dept_indexed)
depts_manifest = json.dumps(depts_manifest)

target = open("../../app/data/dept_indexed.json", 'w')
target.write(str(dept_indexed))

target = open("../../app/data/ccn_indexed.json", 'w')
target.write(str(ccn_indexed))

# target = open("../../app/data/dept_mappings.json", 'w')
# target.write(str(dept_mapping))

target = open("../../app/data/depts.json", 'w')
target.write(str(depts_manifest))
