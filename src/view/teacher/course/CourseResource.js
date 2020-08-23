import React, {Component} from 'react';
import {UploadOutlined} from "@ant-design/icons";
import {Alert, Button, Card, Col, message, Row, Space, Table, Tree, Upload} from "antd";
import {getFileByCourseAndTeacher, getResourceByCourseAndTeacher, saveResourceByCourseAndTeacher} from "../../../api";
import Style from "../../view.module.css";
import Config from "../../../config/config";

const { DirectoryTree } = Tree;

class CourseResource extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 5,
            total: 0,
            fileData: [],
            treeData: [],
            courseId: props.match.params.id,
            teacherId: localStorage.getItem("id"),
            number: localStorage.getItem("number"),
            token: localStorage.getItem("token"),
        }
    }

    componentDidMount() {
        const {courseId, teacherId, number, token} = this.state;
        getResourceByCourseAndTeacher(courseId, teacherId, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    if (response.data === null) {
                        return;
                    }
                    let temp = [];
                    temp.push(response.data);
                    this.setState({treeData: temp});
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
            console.log(e);
            message.error("无法连接到服务器！");
        });
        this.getFileData(this.state.page, this.state.pageSize);
    }

    uploadConfig = {
        name: 'file',
        data: {
            courseId: this.props.match.params.id,
            teacherId: localStorage.getItem("id"),
        },
        action: 'http://127.0.0.1:8001/file',
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功！`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败！`);
            }
        },
    };

    render() {
        return (
            <div>
                <Card title='课程资源'>
                    <Alert message="注意" type="warning" showIcon closable className={Style.marginBottom18}
                        description="创建文件或目录时，需先选中目录才可创建，创建完文件后需手动添加资源引用。"/>
                    <Row gutter={24}>
                        <Col span={12}>
                            <DirectoryTree multiple defaultExpandAll onSelect = {this.onSelect} onExpand={this.onExpand}
                                treeData={this.state.treeData}
                            />
                            <div className={Style.marginTop18}>
                                <Space>
                                    <Button >新建目录</Button>
                                    <Button>新建文件</Button>
                                    <Button>添加引用</Button>
                                </Space>
                            </div>
                        </Col>
                        <Col span={12}>
                            <Table pagination={{current: this.state.page, total: this.state.total, pageSize: this.state.pageSize, onChange: this.onTableChange, onShowSizeChange: this.onShowSizeChange}}
                                   columns={this.fileColumns} dataSource={this.state.fileData}/>
                            <Upload {...this.uploadConfig}>
                                <Button>
                                    <UploadOutlined /> 上传
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }

    onTableChange = (page, pageSize) => {
        this.getFileData(page, pageSize);
        this.setState({page, pageSize});
    }

    onShowSizeChange = (page, pageSize) => {
        this.getFileData(page, pageSize);
        this.setState({page, pageSize});
    }

    getFileData = (page, pageSize) => {
        const {courseId, teacherId, number, token} = this.state;
        getFileByCourseAndTeacher(page, pageSize, courseId, teacherId, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    let res = [];
                    for (let i = 0, length = response.data.list.length; i < length; i++) {
                        let temp = {
                            index: (i + 1).toString(),
                            key: (i + 1).toString(),
                            id: response.data.list[i].id,
                            logic: response.data.list[i].logicalName,
                            url: response.data.list[i].url,
                        }
                        res.push(temp);
                    }
                    this.setState({fileData: res, total: response.data.count});
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
            console.log(e);
            message.error("无法连接到服务器！");
        });
    }

    onSave = () => {
        const {number, token} = this.state;
        let courseId = this.props.match.params.id;
        let teacherId = localStorage.getItem("id");
        saveResourceByCourseAndTeacher(this.treeData[0], courseId, teacherId, number, token).then(response => {
            message.info(response.data);
        });
    }

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
    };

    fileColumns = [
        {
            title: '序号',
            key: 'index',
            dataIndex: 'index',
        },
        {
            title: '文件名',
            key: 'logic',
            dataIndex: 'logic',
        },
    ]

}

export default CourseResource;