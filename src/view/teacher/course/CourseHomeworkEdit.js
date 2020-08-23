import React, {Component} from 'react';
import {Badge, Button, Card, DatePicker, Descriptions, Form, Input, message, Radio} from "antd";
import BraftEditor from "braft-editor";
import Style from '../../view.module.css';
import 'braft-editor/dist/index.css';
import moment from 'moment';
import {addWorkInfo, getWorkById, publishWorkInfoById, saveWorkInfoById} from "../../../api";
import Config from "../../../config/config";

class CourseHomeworkEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            add: props.add,
            permit: 1,
            title: '',
            deadline: '2020-08-22 10:00:00',
            outputHTML: '<p></p>',
            editorState: BraftEditor.createEditorState('<p>在此填写作业内容</p>'), // 设置编辑器初始内容
            number: localStorage.getItem("number"),
            token: localStorage.getItem("token"),
        }
    }

    onRadioChange = e => {
        this.setState({permit: e.target.value});
    };

    onInputChange = e => {
        this.setState({title: e.target.value})
    }

    onDateChange = (moment, dateString) => {
        this.setState({deadline: dateString});
    }

    componentDidMount () {
        this.isLivinig = true;
        const {number, token, add} = this.state;
        // 指示此控件为添加作业，而非修改作业
        if (add === true) {
            return;
        }
        let workId = this.props.match.params.workId;
        getWorkById(workId, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    if (response.data === null) {
                        return;
                    }
                    this.setState({
                        id: response.data.id,
                        permit: response.data.permit,
                        title: response.data.title,
                        deadline: response.data.deadline,
                        outputHTML: response.data.content,
                    });
                    this.setEditorContentAsync(response.data.content);
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

    componentWillUnmount () {
        this.isLivinig = false
    }

    handleChange = (editorState) => {
        this.setState({
            editorState: editorState,
            outputHTML: editorState.toHTML()
        })
    }

    setEditorContentAsync = content => {
        this.isLivinig && this.setState({
            editorState: BraftEditor.createEditorState(content)
        })
    }

    render() {
        const { editorState, add } = this.state;
        return (
            <div>
                {
                    add === true ? (
                        <div className={Style.marginTop18}>
                            <Descriptions bordered>
                                <Descriptions.Item label="标题" span={3}>
                                    <Input className={Style.width300} value={this.state.title} onChange={this.onInputChange}/>
                                </Descriptions.Item>
                                <Descriptions.Item label="内容" span={3}>
                                    <BraftEditor value={editorState} onChange={this.handleChange}/>
                                </Descriptions.Item>
                                <Descriptions.Item label="允许提交次数" span={3}>
                                    <Radio.Group onChange={this.onRadioChange} value={this.state.permit}>
                                        <Radio value={1}>一次</Radio>
                                        <Radio value={2}>多次</Radio>
                                    </Radio.Group>
                                </Descriptions.Item>
                                <Descriptions.Item label="截止时间" span={3}>
                                    <DatePicker showTime allowClear={false} format="YYYY-MM-DD HH:mm:ss" value={moment(this.state.deadline, "YYYY-MM-DD HH:mm:ss")} onChange={this.onDateChange}/>
                                </Descriptions.Item>
                            </Descriptions>
                            <div className={[Style.marginTop18, Style.center].join(" ")}>
                                <Button onClick={this.saveWorkInfo}>保存</Button>&emsp;&emsp;
                                <Button type='primary' onClick={this.publishWork}>发布</Button>
                            </div>
                        </div>
                    ) : (
                        <Card title={'编辑作业'}>
                            <Descriptions bordered>
                                <Descriptions.Item label="标题" span={3}>
                                    <Input className={Style.width300} value={this.state.title} onChange={this.onInputChange}/>
                                </Descriptions.Item>
                                <Descriptions.Item label="内容" span={3}>
                                    <BraftEditor value={editorState} onChange={this.handleChange}/>
                                </Descriptions.Item>
                                <Descriptions.Item label="允许提交次数" span={3}>
                                    <Radio.Group onChange={this.onRadioChange} value={this.state.permit}>
                                        <Radio value={1}>一次</Radio>
                                        <Radio value={2}>多次</Radio>
                                    </Radio.Group>
                                </Descriptions.Item>
                                <Descriptions.Item label="截止时间" span={3}>
                                    <DatePicker showTime allowClear={false} format="YYYY-MM-DD HH:mm:ss" value={moment(this.state.deadline, "YYYY-MM-DD HH:mm:ss")} onChange={this.onDateChange}/>
                                </Descriptions.Item>
                            </Descriptions>
                            <div className={[Style.marginTop18, Style.center].join(" ")}>
                                <Button onClick={this.saveWorkInfo}>保存</Button>&emsp;&emsp;
                                <Button type='primary' onClick={this.publishWork}>发布</Button>
                            </div>
                        </Card>
                    )
                }
            </div>
        );
    }

    validate = () => {
        if (!this.state.title) {
            message.error('作业标题不能为空！');
            return false;
        }
        if (this.state.outputHTML === '<p></p>') {
            message.error('作业内容不能为空！');
            return false;
        }
        if (!this.state.deadline) {
            message.error('请选择截止时间！');
            return false;
        }
        return true;
    }

    saveWorkInfo = () => {
        let result = this.validate();
        if (result === false) {
            return;
        }

        const {number, token, add} = this.state;
        let operation;
        let work = {
            id: this.state.id,
            permit: this.state.permit,
            title: this.state.title,
            deadline: this.state.deadline,
            outputHTML: this.state.outputHTML,
        }
        if (add === true) {
            operation = addWorkInfo(work, number, token);
        } else {
            operation = saveWorkInfoById(work, number, token);
        }
        operation.then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    message.success("保存成功！");
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

    publishWork = () => {
        let result = this.validate();
        if (result === false) {
            return;
        }

        const {number, token} = this.state;
        let work = {
            id: this.state.id,
            permit: this.state.permit,
            title: this.state.title,
            deadline: this.state.deadline,
            outputHTML: this.state.outputHTML,
        }
        publishWorkInfoById(work, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    message.success("保存成功！");
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

export default CourseHomeworkEdit;