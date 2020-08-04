import React, {Component} from 'react';
import {Button, Form, Input} from "antd";
import styles from './login.module.less';
import Style from './Login.module.css';
import {CloseCircleOutlined, UserOutlined, LockOutlined} from '@ant-design/icons'
import {MyAvatar} from "./MyAvatar";
import {login} from "../../api";
import Config from "../../config/config";

class Login extends Component {

    formRef = React.createRef();

    render() {
        return (
            <div className={[styles.wrapper, styles.matchVertical].join(" ")}>
                <div className={[styles.matchVertical, styles.flex, Style.bg].join(" ")}>
                    <div className={Style.verticalCenter}>
                        <div className={[Style.center, Style.title].join(" ")}>系统 | 登录</div><br/>
                        <div className={[Style.borderRadius, Style.body].join(" ")}>
                            <div className={[Style.matchWidth, Style.head].join(" ")}>
                                <span className={[Style.block, Style.marginLeft].join(" ")}>
                                    <CloseCircleOutlined className={Style.icon}/>
                                </span>
                                <span className={[Style.block, Style.circlePoint, Style.marginRight, Style.right, Style.backOrange].join(" ")}/>
                                <span className={[Style.block, Style.circlePoint, Style.marginRight, Style.right, Style.backPink].join(" ")}/>
                                <span className={[Style.block, Style.circlePoint, Style.marginRight, Style.right, Style.backBlue].join(" ")}/>
                            </div>
                            <div className={Style.matchWidth}><span className={[Style.block, Style.center, Style.centerPic].join(" ")}><MyAvatar/></span></div>
                            <div className={styles.wrapper}>
                                <Form ref={this.formRef} name="normal_login" onFinish={this.onFinish}>
                                    <Form.Item className={Style.formItem} name="number" rules={[{ required: true, message: '请输入学号或工号！' }]}>
                                        <Input bordered={false} prefix={<UserOutlined className={Style.icon} />} placeholder="学号/工号" />
                                    </Form.Item>
                                    <Form.Item className={Style.formItem} name="password" rules={[{ required: true, message: '请输入密码！' }]}>
                                        <Input bordered={false} prefix={<LockOutlined className={Style.icon} />} type="password" placeholder="密码"/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button size={'large'} type="primary" htmlType="submit" className={[Style.matchWidth, Style.button].join(" ")}>
                                            登录
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onFinish = values => {
        login(values).then(response => {
            /*switch (response.code) {
                case Config.SUCCESS:
                    localStorage.setItem("number", response.data.number);
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", response.data.user);
                    break;
                case Config.OPERATE_FAIL:
                    console.log(response.data);
                    break;
                default:
            }*/
        });
    }
}

export default Login;