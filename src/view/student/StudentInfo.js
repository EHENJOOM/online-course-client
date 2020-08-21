import React, {Component} from 'react';
import Style from "../view.module.css";
import {Breadcrumb, Layout} from "antd";

const {Content} = Layout;

class StudentInfo extends Component {
    render() {
        return (
            <div className={Style.parent}>
                <Content className={Style.body}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>个人</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={Style.content}>
                        Content
                    </div>
                </Content>
            </div>
        );
    }
}

export default StudentInfo;