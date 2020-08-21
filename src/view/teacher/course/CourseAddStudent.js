import React, {Component} from 'react';
import {Button, Card, Form, Input, message, Select, Table, Tabs} from "antd";
import Style from "../../view.module.css";
import {
    addStudentToClazzByClazz,
    addStudentToClazzManual,
    getClazzByAcademyAndGrade,
    getStudentByNameAndNumber
} from "../../../api";
import Config from "../../../config/config";
import {SearchOutlined, PlusOutlined} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;

class CourseAddStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            manualData: [],
            clazzData: [],
            number: localStorage.getItem("number"),
            token: localStorage.getItem("token"),
        }
    }

    render() {
        return (
            <div className={Style.matchHeight}>
                <Card title={'添加学生'} className={Style.matchHeight}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="手动添加" key="1">
                            <Form style={{display: 'inline-flex'}} name="horizontal_login" layout="inline" onFinish={this.searchStudent}>
                                <Form.Item name="username" label="学生姓名">
                                    <Input placeholder="姓名" />
                                </Form.Item>
                                <Form.Item name="number" label="学号">
                                    <Input placeholder="学号"/>
                                </Form.Item>
                                <Form.Item shouldUpdate>
                                    <Button icon={<SearchOutlined />} htmlType="submit">查找</Button>
                                </Form.Item>
                            </Form>
                            <Button type='primary' icon={<PlusOutlined />} onClick={this.addManualSelectedHandler}>添加</Button>
                            <Table className={Style.marginTop18} rowSelection={this.manualRowSelection} columns={manualColumns} dataSource={this.state.manualData}/>
                        </TabPane>
                        <TabPane tab="按班级添加" key="3">
                            <Form ref={this.formRef} layout="inline" style={{display: 'inline-flex'}} onFinish={this.searchClazz}>
                                <Form.Item name="academy" label="学院" initialValue='经济管理学院'>
                                    <Select>
                                        {academy.map((item, index) => {
                                            return <Option key={index} value={item}>{item}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="grade" label='年级' initialValue='2017'>
                                    <Select>
                                        <Option value='2017'>2017</Option>
                                        <Option value='2018'>2018</Option>
                                        <Option value='2019'>2019</Option>
                                        <Option value='2020'>2020</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button icon={<SearchOutlined />} htmlType="submit">查找</Button>
                                </Form.Item>
                            </Form>
                            <Button type='primary' icon={<PlusOutlined />} onClick={this.addClazzSelectedHandler}>添加</Button>
                            <Table className={Style.marginTop18} rowSelection={this.clazzRowSelection} columns={clazzColumns} dataSource={this.state.clazzData}/>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }

    searchStudent = values => {
        const {token} = this.state;
        getStudentByNameAndNumber(values, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    var res = [];
                    for (let i = 0, length = response.data.length; i < length; i++) {
                        var temp = {
                            index: i + 1,
                            key: response.data[i]['id'].toString(),
                            name: response.data[i]['name'],
                            number: response.data[i]['number'],
                            academy: response.data[i]['academy'],
                            major: response.data[i]['major'],
                            clazz: response.data[i]['clazz'],
                        };
                        res.push(temp);
                    }
                    this.setState({manualData: res});
                    break;
                case Config.NO_DATA:
                    message.warning("没有匹配的数据！");
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

    searchClazz = values => {
        const {number, token} = this.state;
        getClazzByAcademyAndGrade(values, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    let res = [];
                    for (let i = 0, length = response.data.length; i < length; i++) {
                        let temp = {
                            index: i + 1,
                            key: response.data[i]['id'].toString(),
                            code: response.data[i]['code'],
                            clazz: response.data[i]['name'],
                            academy: response.data[i]['academy'],
                            grade: response.data[i]['grade'],
                            count: response.data[i]['count'],
                        };
                        res.push(temp);
                    }
                    this.setState({clazzData: res});
                    break;
                case Config.NO_DATA:
                    message.warning("没有匹配的数据！");
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

    manualRowSelection = {
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
            this.manualSelectedData = [];
            let courseId = this.props.match.params.id;
            for (let i = 0, length = selectedRowKeys.length; i < length; i++) {
                let temp = {
                    courseId: courseId,
                    studentId: selectedRows[i].id,
                }
                this.manualSelectedData.push(temp);
            }
        },
    }

    clazzRowSelection = {
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
            this.clazzSelectedData = [];
            for (let i = 0, length = selectedRowKeys.length; i < length; i++) {
                this.manualSelectedData.push(selectedRows[i].clazz);
            }
        },
    }

    manualSelectedData = []

    clazzSelectedData = []

    addManualSelectedHandler = () => {
        const {number, token} = this.state;
        addStudentToClazzManual(this.manualSelectedData, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    message.success("添加成功！")
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

    addClazzSelectedHandler = () => {
        const {number, token} = this.state;
        addStudentToClazzByClazz(this.manualSelectedData, this.props.match.params.id, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    message.success("添加成功！")
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

}

const academy = [
    "化学工程学院", "材料科学与工程学院", "机电工程学院", "信息科学与技术学院",
    "经济管理学院", "化学学院", "数理学院", "文法学院", "生命科学与技术学院"
]

const manualColumns = [
    {
        title: '序号',
        dataIndex: 'index',
    },
    {
        title: '姓名',
        dataIndex: 'name',
    },
    {
        title: '学号',
        dataIndex: 'number',
    },
    {
        title: '学院',
        dataIndex: 'academy',
    },
    {
        title: '专业',
        dataIndex: 'major',
    },
    {
        title: '班级',
        dataIndex: 'clazz',
    },
];

const clazzColumns = [
    {
        title: '序号',
        dataIndex: 'index',
    },
    {
        title: '班级',
        dataIndex: 'clazz',
    },
    {
        title: '编号',
        dataIndex: 'code',
    },
    {
        title: '学院',
        dataIndex: 'academy',
    },
    {
        title: '年级',
        dataIndex: 'grade',
    },
    {
        title: '人数',
        dataIndex: 'count',
    },
]

export default CourseAddStudent;