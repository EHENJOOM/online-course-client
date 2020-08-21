import Loadable from "react-loadable"
import Loading from "../component/loading";

const Login = Loadable({
    loader: () => import("./login"),
    loading: Loading
});
const NotFound = Loadable({
    loader: () => import("./notfound"),
    loading: Loading
});
const StudentHome = Loadable({
    loader: () => import("./student/StudentHome"),
    loading: Loading
});
const StudentCourse = Loadable({
    loader: () => import("./student/StudentCourse"),
    loading: Loading
});
const StudentInfo = Loadable({
    loader: () => import("./student/StudentInfo"),
    loading: Loading
});
const TeacherHome = Loadable({
    loader: () => import("./teacher/TeacherHome"),
    loading: Loading
});
const TeacherCourse = Loadable({
    loader: () => import("./teacher/TeacherCourse"),
    loading: Loading
});
const TeacherCourseEdit = Loadable({
    loader: () => import("./teacher/TeacherCourseEdit"),
    loading: Loading
});
const CourseAddColumn = Loadable({
    loader: () => import("./teacher/course/CourseAddColumn"),
    loading: Loading
});
const CourseAddStudent = Loadable({
    loader: () => import("./teacher/course/CourseAddStudent"),
    loading: Loading
});
const CourseAddUnit = Loadable({
    loader: () => import("./teacher/course/CourseAddUnit"),
    loading: Loading
});
const CourseAnswer = Loadable({
    loader: () => import("./teacher/course/CourseAnswer"),
    loading: Loading
});
const CourseCalendar = Loadable({
    loader: () => import("./teacher/course/CourseCalendar"),
    loading: Loading
});
const CourseHomework = Loadable({
    loader: () => import("./teacher/course/CourseHomework"),
    loading: Loading
});
const CourseIntroduce = Loadable({
    loader: () => import("./teacher/course/CourseIntroduce"),
    loading: Loading
});
const CourseOutline = Loadable({
    loader: () => import("./teacher/course/CourseOutline"),
    loading: Loading
});
const CourseResource = Loadable({
    loader: () => import("./teacher/course/CourseResource"),
    loading: Loading
});
const CourseHomeworkEdit = Loadable({
    loader: () => import("./teacher/course/CourseHomeworkEdit"),
    loading: Loading
});

export {
    Login,
    NotFound,
    StudentInfo,
    StudentHome,
    StudentCourse,
    TeacherHome,
    TeacherCourse,
    TeacherCourseEdit,
    CourseAddColumn,
    CourseAddStudent,
    CourseAddUnit,
    CourseAnswer,
    CourseCalendar,
    CourseHomework,
    CourseIntroduce,
    CourseOutline,
    CourseResource,
    CourseHomeworkEdit,
}