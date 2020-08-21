import React, {Component} from 'react';
import {Affix, Button, Card, Col, Layout, List, message, Row} from "antd";
import Style from "../view.module.css";
import {getCourseByTeacherId} from "../../api";
import Config from "../../config/config";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";

class TeacherHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courseList: [],
            info: props.info,
        }
    }

    componentDidMount() {
        let id = localStorage.getItem("id");
        let number = localStorage.getItem("number");
        let token = localStorage.getItem("token");
        getCourseByTeacherId(id, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    this.setState({courseList: response.data.list});
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
                <Row>
                    <Col span={4} offset={3}>
                        <Affix offsetTop={20} className={Style.marginTop30}>
                            <div className={[Style.affixBody, Style.borderRadius15].join(" ")}>
                                <div className={Style.displayFlex}>
                                    <img className={Style.affixImg} src={"/img/avatar.gif"}/>
                                </div>
                                <div style={{fontSize: "20px", fontWeight: "bold", textAlign: "center",}}>{this.state.info.name}&nbsp;&nbsp;{React.createElement(EditOutlined, {className: Style.edit, onClick: this.edit})}
                                </div>
                            </div>
                        </Affix>
                    </Col>
                    <Col span={14} offset={1}>
                        <Card title={'课程列表'} className={[Style.marginTop30, Style.borderRadius15].join(" ")}>
                            <div className={Style.affixBody}>
                                <List
                                    grid={{gutter: 24, column: 3}}
                                    dataSource={this.state.courseList}
                                    renderItem = {item => (
                                        <List.Item>
                                            <Card
                                                hoverable={true}
                                                cover={<img className={Style.coverImg} src={item.img === null ? "https://course-proxy2.buct.edu.cn/meol/homepage/styles/guojiakaifangdaxue_style/image/default_course_img.jpg" : item.img}/>}
                                                actions={[
                                                    <Button type={'primary'} onClick={this.menuHandler.bind(this, item.id)}>课程管理</Button>,
                                                    <Button>课程预览</Button>
                                                ]}
                                            >
                                                <div className={Style.courseListTitle}>{item.name}</div>
                                                <span>课程编号：{item.code}</span><br/>
                                                <span>主讲教师：{item.teacherPo.name}</span>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }

    edit = () => {

    }

    menuHandler = (courseId) => {
        this.props.history.push('/teacher/course/' + courseId);
    }


}

export default TeacherHome;