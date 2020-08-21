import axios from "axios";
import {message} from "antd";
import {stringify} from "qs";
import Config from "../config/config";
import history from "../index";
import {createHashHistory} from "history";

const service = axios.create({
    baseURL: "http://localhost:8001/"
});

service.interceptors.request.use(config => {
    // config代表发送给服务器的信息，后期自己根据需要填充数据，自己配置即可

    // 兼容 post 跨域问题
    if (config.method === 'post') {
        // 修改 Content-Type
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // 将对象参数转换为序列化的 URL 形式（key=val&key=val）
        config.data = stringify(config.data);
    }
    return config;
}, (error) => {
    console.log(error);
    return Promise.reject(error);
});

service.interceptors.response.use(response => {
    if (response.status === 200) {
        console.log(response.data);
        return response.data;
    } else {
        // 统一处理错误
        message.error("系统繁忙，请稍后再试！")
    }
});

const login = values => {
    return service.get(`login`, {
        params: {"number": values.number, "password": values.password}
    });
};
const authorize = (number, token) => {
    return service.get('authorize', {
        params: {"number": number, "token": token}
    });
};
const getStudentInfoById = (id, number, token) => {
    return service.get(`student/${id}`, {
        params: {"number": number, "token": token}
    });
};
const getTeacherInfoById = (id, number, token) => {
    return service.get(`teacher/${id}`, {
        params: {"number": number, "token": token}
    });
};
const getCourseByTeacherId = (teacherId, number, token) => {
    return service.get(`course/teacher/${teacherId}`, {
        params: {"number": number, "token": token}
    });
};
const getCourseByCourseId = (courseId, number, token) => {
    return service.get(`course/${courseId}`, {
        params: {"number": number, "token": token}
    });
};
const updateCourseDescription = (id, description, number, token) => {
    return service.put(`course`, {
        id: id,
        description: description,
        number: number,
        token: token,
    });
};
const updateCourseOutline = (id, outline, number, token) => {
    return service.put(`course`, {
        id: id,
        outline: outline,
        number: number,
        token: token,
    });
};
const updateCourseCalendar = (id, calendar, number, token) => {
    return service.put(`course`, {
        id: id,
        calendar: calendar,
        number: number,
        token: token,
    });
};
const getStudentByNameAndNumber = (values, token) => {
    return service.get(`student`, {
        params: {"name": values.username, "number": values.number, "token": token}
    });
};
const addStudentToClazzManual = (values, number, token) => {
    return service.post(`clazz`, {
        data: values,
        number: number,
        token: token,
    });
};
const addStudentToClazzByClazz = (values, id, number, token) => {
    console.log(JSON.stringify(values));
    return service.post(`clazz/byClazz`, {
        courseId: id,
        data: JSON.stringify(values),
        number: number,
        token: token,
    });
};
const getClazzByAcademyAndGrade = (values, number, token) => {
    return service.get(`adminClazz`, {
        params: {"academy": values.academy, "grade": values.grade, "number": number, "token": token}
    });
};
const getWorkTitleByTeacherId = (courseId, number, token) => {
    return service.get(`work/teacher/${courseId}`, {
        params: {"number": number, "token": token}
    });
};
const getSubmitWorkStatisticsByWorkId = (courseId, workId, number, token) => {
    return service.get(`work/statistics/${courseId}`, {
        params: {"workId": workId, "number": number, "token": token}
    });
};

export {
    login,
    authorize,
    getStudentInfoById,
    getTeacherInfoById,
    getCourseByTeacherId,
    getCourseByCourseId,
    updateCourseDescription,
    updateCourseOutline,
    updateCourseCalendar,
    getStudentByNameAndNumber,
    addStudentToClazzManual,
    addStudentToClazzByClazz,
    getClazzByAcademyAndGrade,
    getWorkTitleByTeacherId,
    getSubmitWorkStatisticsByWorkId,
}