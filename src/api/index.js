import axios from "axios";
import {message} from "antd";
import {stringify} from "qs";

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

export {
    login,
}