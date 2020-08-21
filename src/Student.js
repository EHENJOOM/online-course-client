import React, {Component} from 'react';
import {authorize, getStudentInfoById} from "./api";
import Config from "./config/config";
import Style from "./main.module.css";
import {Layout, Menu, Avatar, Dropdown, message} from 'antd';
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import {Redirect, Route, Switch} from "react-router";
import {studentRoutes} from "./routers";

const { Header } = Layout;

class Student extends Component {

    constructor(props) {
        super(props);
        this.props.history.listen(location => {
            var one = studentRoutes.find(item => {
                return item.pathname === location.pathname;
            });
            window.document.timeline = one && one.title;
        });
        this.state = {
            info: {},
        }
    }

    componentWillMount() {
        authorize(localStorage.getItem("number"), localStorage.getItem("token")).then(response => {
            if (response.code === Config.NOT_AUTHORIZE) {
                this.props.history.push("/login");
            }
        });
    }

    componentDidMount() {
        let id = localStorage.getItem("id");
        let number = localStorage.getItem("number");
        let token = localStorage.getItem("token");
        getStudentInfoById(id, number, token).then(response => {
           switch (response.code) {
               case Config.SUCCESS:
                   this.setState({info: response.data});
                   break;
               case Config.SERVER_ERROR:
                   message.error("服务器异常，请稍后再试！");
                   break;
               case Config.NOT_AUTHORIZE:
                   this.props.history.push("/login");
                   break;
               default:
                   message.error("未知错误，错误码：" + response.code);
           }
        }).catch(e => {
            message.error("无法连接到服务器！");
        });
    }

    render() {
        return (
            <Layout className={Style.matchHeight}>
                <Header>
                    <span className={Style.logo}>Course</span>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['/student/home']} selectedKeys={this.props.location.pathname} className={Style.menu} onSelect={this.menuHandler}>
                        {studentRoutes.map((item, index) => {
                            return <Menu.Item key={studentRoutes[index].pathname}>{studentRoutes[index].title}</Menu.Item>;
                        })}
                    </Menu>
                    <span className={[Style.menu, Style.rightHead].join(" ")}>
                        <Dropdown overlay={this.menus()}>
                            <div>
                                {this.state.info.avatar === null ?
                                    <Avatar className={Style.headerImage} style={{backgroundColor: "#FFBF00"}}>{this.state.info.name.substring(0, 1)}</Avatar>
                                    :
                                    <Avatar className={Style.headerImage} src={this.state.info.avatar}/>}&nbsp;&nbsp;
                                <span className={Style.headerName}>{this.state.info.name}</span>&nbsp;<DownOutlined/>
                            </div>
                        </Dropdown>
                    </span>
                </Header>
                <Switch>
                    {studentRoutes.map(item => {
                        return (
                            <Route key={item.pathname} exact={item.exact} path={item.pathname} render={(rootProps => {
                                return <item.component {...rootProps}/>
                            })}/>
                        );
                    })}
                    <Redirect from={'/student'} to={studentRoutes[0].pathname}/>
                    <Redirect to={"/404"}/>
                </Switch>
                <div className={Style.footer}>Course Platform ©2020 Created by EHENJOOM</div>
            </Layout>
        );
    }

    menus = () => {
        return (
            <Menu onClick={this.menuHandler}>
                <Menu.Item key={'/login'}>退出</Menu.Item>
            </Menu>
        )
    }

    menuHandler = ({item, key, keyPath, domEvent}) =>  {
        this.props.history.push(key);
    }
}

export default Student;