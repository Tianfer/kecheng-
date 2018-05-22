const typeStore = {
  string: '[object String]',
  number: '[object Number]'
}

const paramsConfig = {
  getCourses: {
    building: typeStore['string'],
    day: typeStore['string'],
    week: typeStore['string']
  },
  commentCourse: {
    class_id: typeStore['number'],
    teacher_id: typeStore['string'],
    teacher_name: typeStore['string'],
    course_id: typeStore['string'],
    course_name: typeStore['string'],           // 课程名
    time_week: typeStore['number'],
    time_day: typeStore['number'],
    time_detail: typeStore['string'],           // 第几节
    building: typeStore['string'],
    classroom: typeStore['string'],
    class_name: typeStore['string'],            // 哪件教室
    class_type: typeStore['string'],            // 课程类型
    grade: typeStore['string'],
    age: typeStore['string'],                   // 年龄
    pro_title: typeStore['string'],             // 职称
    unit: typeStore['string'],                  // 单位
    all_people: typeStore['number'],                   // 总人数
    presence: typeStore['number'],              // 缺席人数
    time_days: typeStore['string'],             // 时间 2018-04-20
    class_room_type: typeStore['string'],       // 教室类型
    attitude_score: typeStore['number'],
    content_score: typeStore['number'],
    method_score: typeStore['number'],
    manage_score: typeStore['number'],
    effect_score: typeStore['number'],
    count_score: typeStore['number'],
    count_grade: typeStore['string'],
    // imgs: typeStore['string']                // 非必填项
    // other_advise: typeStore['string']        // 非必填项
  },
  getCourse: {
    id: typeStore['number']
  }
}

module.exports = paramsConfig