import React, {Component} from 'react';
import {Avatar, Dropdown, Layout, Menu, message} from "antd";
import Style from "./main.module.css";
import {teacherRoutes} from "./routers";
import {Redirect, Route, Switch} from "react-router";
import {authorize, getTeacherInfoById} from "./api";
import Config from "./config/config";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";

const { Header, Content } = Layout;

class Teacher extends Component {

    constructor(props) {
        super(props);
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
        let user = localStorage.getItem("user");

        if (parseInt(user) !== Config.USER_TEACHER) {
            this.props.history.push("/login");
            return;
        }

        getTeacherInfoById(id, number, token).then(response => {
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
            <Layout className={Style.minMatchHeight}>
                <Header className="header">
                    <span className={Style.logo}>Course</span>
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
                <Content className={[Style.body, Style.matchHeight].join(" ")} key={this.props.location.key}>
                    <Switch>
                        {teacherRoutes.map(item => {
                            return <Route path={item.pathname} key={item.pathname} exact={item.exact} render={(rootProps => {
                                return <item.component {...rootProps} info={this.state.info}/>
                            })}/>
                        })}
                        <Redirect from={'/teacher'} to={teacherRoutes[0].pathname}/>
                        <Redirect to={'/404'}/>
                    </Switch>
                </Content>
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

export default Teacher;