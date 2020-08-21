import React, {Component} from 'react';
import {Layout, Menu, message} from "antd";
import Style from "../view.module.css";
import {UserOutlined, BookOutlined, GiftOutlined,
    PicLeftOutlined, BarsOutlined, UserAddOutlined,
    AppstoreAddOutlined, FileAddOutlined, ProfileOutlined,
    CalendarOutlined, FormOutlined, QuestionCircleOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {courseRoutes} from "../../routers";
import {Redirect, Route, Switch} from "react-router";
import {getCourseByCourseId} from "../../api";
import Config from "../../config/config";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

class TeacherCourseEdit extends Component {

    constructor(props) {
        super(props);
        this.props.history.listen(location => {
            var one = courseRoutes.find(item => {
                return item.pathname.replace(":id", props.match.params.id) === location.pathname;
            });
            window.document.timeline = one && one.title;
        });
        this.state = {
            course: {},
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        let number = localStorage.getItem("number");
        let token = localStorage.getItem("token");
        getCourseByCourseId(id, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    this.setState({course: response.data});
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
            <div>
                <div className={[Style.title, Style.marginTop30].join(" ")}>{this.state.course.name}</div>
                <Layout className={[Style.content, Style.marginTop30].join(" ")} style={{ padding: '24px 0' }} >
                    <Sider style={{backgroundColor: 'white'}} width={200}>
                        <Menu
                            mode="inline"
                            onSelect={this.menuHandler}
                            defaultSelectedKeys={[courseRoutes[0].pathname]}
                            defaultOpenKeys={['info']}
                            style={{ height: '100%' }}
                        >
                            <SubMenu key="info" icon={<InfoCircleOutlined />} title="基本信息">
                                <Menu.Item key={courseRoutes[0].pathname} icon={<BarsOutlined />}>课程介绍</Menu.Item>
                                <Menu.Item key={courseRoutes[1].pathname} icon={<PicLeftOutlined />}>教学大纲</Menu.Item>
                                <Menu.Item key={courseRoutes[2].pathname} icon={<CalendarOutlined />}>教学日历</Menu.Item>
                            </SubMenu>
                            <SubMenu key="stu" icon={<UserOutlined />} title="选课学生管理">
                                <Menu.Item key={courseRoutes[3].pathname} icon={<UserAddOutlined />}>添加学生</Menu.Item>
                            </SubMenu>
                            <SubMenu key="add" icon={<BookOutlined />} title="单元学习">
                                <Menu.Item key={courseRoutes[4].pathname} icon={<FileAddOutlined />}>新建学习单元</Menu.Item>
                                <Menu.Item key={courseRoutes[5].pathname} icon={<AppstoreAddOutlined />}>新建栏目</Menu.Item>
                            </SubMenu>
                            <SubMenu key="act" icon={<GiftOutlined />} title="课程活动">
                                <Menu.Item key={courseRoutes[6].pathname} icon={<ProfileOutlined />}>课程资源</Menu.Item>
                                <Menu.Item key={courseRoutes[7].pathname} icon={<FormOutlined />}>课程作业</Menu.Item>
                                <Menu.Item key={courseRoutes[8].pathname} icon={<QuestionCircleOutlined />}>答疑讨论</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Content style={{ padding: '0 24px',}}>
                        <Switch>
                            {courseRoutes.map(item => {
                                return <Route path={item.pathname} key={item.pathname} exact={item.exact} render={(rootProps => {
                                    return <item.component {...rootProps} course={this.state.course}/>
                                })}/>
                            })}
                            <Redirect from={'/teacher/course/' + this.props.match.params.id} to={courseRoutes[0].pathname.replace(":id", this.props.match.params.id)}/>
                            <Redirect to={'/404'}/>
                        </Switch>
                    </Content>
                </Layout>
            </div>
        );
    }

    menuHandler = ({item, key, keyPath, domEvent}) =>  {
        this.props.history.push(key.replace(":id", this.props.match.params.id));
    }
}

export default TeacherCourseEdit;