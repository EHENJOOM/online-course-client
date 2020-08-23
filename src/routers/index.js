import {
    CourseAddColumn,
    CourseAddStudent, CourseAddUnit, CourseAnswer,
    CourseCalendar, CourseHomework, CourseHomeworkCheck, CourseHomeworkEdit,
    CourseIntroduce, CourseOutline, CourseResource,
    Login,
    NotFound,
    StudentCourse,
    StudentHome,
    StudentInfo,
    TeacherCourse,
    TeacherCourseEdit,
    TeacherHome
} from "../view";

const commonRoutes = [
    {
        pathname: '/login',
        component: Login
    },
    {
        pathname: '/404',
        component: NotFound
    }
];

const studentRoutes = [
    {
        pathname: '/student/home',
        component: StudentHome,
        title: '首页',
        exact: true,
    },
    {
        pathname: '/student/course',
        component: StudentCourse,
        title: '课程',
        exact: true,
    },
    {
        pathname: '/student/info',
        component: StudentInfo,
        title: '个人',
        exact: true,
    },
];

let teacherRoutes = [
    {
        pathname: '/teacher/home',
        component: TeacherHome,
        exact: true,
    },
    {
        pathname: '/teacher/course',
        component: TeacherCourse,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id',
        component: TeacherCourseEdit,
        exact: false,
    },
];

const courseRoutes = [
    {
        pathname: '/teacher/course/:id/info/introduce/',
        component: CourseIntroduce,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/info/outline',
        component: CourseOutline,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/info/calendar',
        component: CourseCalendar,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/add/student',
        component: CourseAddStudent,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/add/unit',
        component: CourseAddUnit,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/add/column',
        component: CourseAddColumn,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/act/resource',
        component: CourseResource,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/act/work',
        component: CourseHomework,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/act/answer',
        component: CourseAnswer,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/act/work/edit/:workId',
        component: CourseHomeworkEdit,
        exact: true,
    },
    {
        pathname: '/teacher/course/:id/act/work/check/:workId',
        component: CourseHomeworkCheck,
        exact: true,
    },
]
// teacherRoutes.push(...courseRoutes)

export {
    commonRoutes,
    studentRoutes,
    teacherRoutes,
    courseRoutes,
}