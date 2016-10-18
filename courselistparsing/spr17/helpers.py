from old_dept_mappings import old_map

day_map = {
    "Monday": "M",
    "Tuesday": "T",
    "Wednesday": "W",
    "Thursday": "R",
    "Friday": "F",
    "Saturday": "Sa",
    "Sunday": "Su",
}

def get_section_info(section):
    days = []
    data = section["days"]
    for day in data.keys():
        if (section["days"][day]):
            abbr = day_map[day]
            days.append(abbr)
    days = ''.join(days)
    if days == '':
        days = ""

    instructors = []
    data = section["instructors"]
    for inst in data:
        name = inst["name"]
        instructors.append(name)
    # Make it a set to remove duplicate instructor names
    instructors = ', '.join(set(instructors))

    start_time = section["startTime"]
    end_time = section["endTime"]

    if len(start_time.split(":")) == 3:
        start_time = start_time[:-3]

    if len(end_time.split(":")) == 3:
        end_time = end_time[:-3]

    try:
        location = section["location"]["description"]
    except:
        location = "TBA"

    return (str(days), str(location), str(instructors), str(start_time), str(end_time))

def filter_dept(dept):
    if dept == "L & S":
        return "LS"
    return dept

def find_id(dept):
    for entry in old_map:
        if dept == entry["code"]:
            id = entry["id"]
            id = str(id)
            return id
    else:
        return ""
