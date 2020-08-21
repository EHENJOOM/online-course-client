import React, {Component} from 'react';
import BraftEditor from "braft-editor";
import {updateCourseCalendar} from "../../../api";
import Config from "../../../config/config";
import {Button, Card, message} from "antd";

class CourseCalendar extends Component {
    state = {
        editorState: BraftEditor.createEditorState(this.props.course.calendar === null ? '<p>在此填写教学日历</p>' : this.props.course.calendar), // 设置编辑器初始内容
        outputHTML: this.props.course.calendar === null ? '<p></p>' : this.props.course.calendar,
    }

    componentDidMount () {
        this.isLivinig = true
        // 3秒后更改编辑器内容
        setTimeout(this.setEditorContentAsync, 3000)
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

    setEditorContentAsync = () => {
        this.isLivinig && this.setState({
            editorState: BraftEditor.createEditorState(this.props.course.calendar === null ? '<p>在此填写教学日历</p>' : this.props.course.calendar)
        })
    }

    update = () => {
        let id = localStorage.getItem("id");
        let number = localStorage.getItem("number");
        let token = localStorage.getItem("token");
        updateCourseCalendar(id, this.state.outputHTML, number, token).then(response => {
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

    render() {
        const { editorState } = this.state

        return (
            <div>
                <Card title={'教学日历'} extra={<Button type={'primary'} onClick={this.update.bind(this)}>保存</Button>}>
                    <div className="editor-wrapper">
                        <BraftEditor
                            value={editorState}
                            onChange={this.handleChange}
                        />
                    </div>
                </Card>
            </div>
        )
    }
}

export default CourseCalendar;