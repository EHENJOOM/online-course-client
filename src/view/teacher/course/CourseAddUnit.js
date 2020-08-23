import React, {Component} from 'react';
import {Button, Card, Collapse, Form, Input, List, Modal, Tag, Tooltip} from "antd";
import {PlusOutlined, PlusSquareOutlined, DiffOutlined} from "@ant-design/icons";
import Style from '../../view.module.css';

const { Panel } = Collapse;

class CourseAddUnit extends Component {

    unitFormRef = React.createRef();

    pointFormRef = React.createRef();

    columnFormRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            selectedUnit: 0,
            columnVisible: false,
            unitVisible: false,
            pointVisible: false,
        }
    }

    render() {
        return (
            <div>
                <Card title='单元学习建设'>
                    <Button prefix={<PlusOutlined/>} type='primary' onClick={this.addStudyUnit}>添加学习单元</Button>
                    <Collapse className={Style.marginTop18} defaultActiveKey={['fsef343']}>
                        {this.data.map((item, index) => {
                            return <Panel key={item.index} header={item.title} extra={this.getExtra(index)}>
                                <List dataSource={item.children}
                                      renderItem={child => (
                                          <List.Item actions={[<Button type='link'>编辑</Button>, <Button type='link'>删除</Button>]}>
                                              <List.Item.Meta
                                                  title={<span>{child.title}&emsp;<Tag color={child.point ? 'success' : 'processing'}>{child.point ? '知识点' : '栏目'}</Tag></span>}
                                                  description={child.description}/>
                                          </List.Item>
                                      )}
                                />
                            </Panel>
                        })}
                    </Collapse>
                </Card>
                <Modal title="添加学习单元"
                    visible={this.state.unitVisible}
                    onOk={this.handleUnitOk} onCancel={this.handleUnitCancel}>
                    <Form ref={this.unitFormRef}>
                        <Form.Item label="单元名称" name="title" rules={[{ required: true, message: '请输入单元名称！' }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="添加知识点"
                       visible={this.state.pointVisible}
                       onOk={this.handlePointOk} onCancel = {this.handlePointCancel}>
                    <Form ref={this.pointFormRef}>
                        <Form.Item label="知识点名称" name="title" rules={[{ required: true, message: '请输入知识点名称！' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="知识点描述" name="description" rules={[{ required: true, message: '请输入知识点描述！' }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="添加栏目"
                       visible={this.state.columnVisible}
                       onOk={this.handleColumnOk} onCancel = {this.handleColumnCancel}>
                    <Form ref={this.columnFormRef}>
                        <Form.Item label="栏目名称" name="title" rules={[{ required: true, message: '请输入栏目名称！' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="栏目描述" name="description" rules={[{ required: true, message: '栏目描述！' }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }

    addStudyUnit = () => {
        this.setState({
            unitVisible: true,
        });
    }

    handleUnitOk = e => {
        let title = this.unitFormRef.current.getFieldsValue('title').title;
        if (title === undefined || title === null || title === '') {
            this.unitFormRef.current.setFields([
                {
                    name: 'title',
                    errors: ['标题不能为空！'],
                }
            ]);
            return;
        }
        let unit = {
            title: title,
            index: uuid(),
            children: [],
        }
        this.data.push(unit);
        this.setState({
            unitVisible: false,
        });
    }

    handleUnitCancel = e => {
        this.setState({
            unitVisible: false,
        });
    }

    handlePointOk = e => {
        let title = this.pointFormRef.current.getFieldsValue('title').title;
        let description = this.pointFormRef.current.getFieldsValue('description').description;
        if (title === undefined || title === null || title === '') {
            this.pointFormRef.current.setFields([
                {
                    name: 'title',
                    errors: ['标题不能为空！'],
                }
            ]);
            return;
        }
        if (description === undefined || description === null || description === '') {
            this.pointFormRef.current.setFields([
                {
                    name: 'description',
                    errors: ['描述不能为空！'],
                }
            ]);
            return;
        }

        let point = {title, description, point: true,};
        this.data[this.state.selectedUnit].children.push(point);
        this.setState({
            pointVisible: false,
        });
    }

    handlePointCancel = e => {
        this.setState({
            pointVisible: false,
        });
    }

    handleColumnOk = e => {
        let title = this.columnFormRef.current.getFieldsValue('title').title;
        if (title === undefined || title === null || title === '') {
            this.columnFormRef.current.setFields([
                {
                    name: 'title',
                    errors: ['标题不能为空！'],
                }
            ]);
            return;
        }
        let description = this.columnFormRef.current.getFieldsValue('description').description;
        if (description === undefined || description === null || description === '') {
            this.columnFormRef.current.setFields([
                {
                    name: 'description',
                    errors: ['描述不能为空！'],
                }
            ]);
            return;
        }
        let point = {title, description, point: false,};
        this.data[this.state.selectedUnit].children.push(point);
        this.setState({
            columnVisible: false,
        });
    }

    handleColumnCancel = e => {
        this.setState({
            columnVisible: false,
        });
    }

    getExtra = (index) => {
        return <div>
            <Tooltip title='添加知识点'>
                <PlusSquareOutlined onClick={e => {
                    e.stopPropagation();
                    this.setState({
                        selectedUnit: index,
                        pointVisible: true,
                    });
                }}/>
            </Tooltip>&emsp;
            <Tooltip title='添加栏目'>
                <DiffOutlined onClick={e => {
                    e.stopPropagation();
                    this.setState({
                        selectedUnit: index,
                        columnVisible: true,
                    });
                }}/>
            </Tooltip>
        </div>;
    }

    data = [
        {
            title: '第一个单元',
            index: 'fsef343',
            children: [
                {
                    title: '知识点1',
                    point: true,
                    description: '知识点1的相关描述',
                },
                {
                    title: '知识点2',
                    point: true,
                    description: '知识点1的相关描述',
                },
                {
                    title: '知识点3',
                    point: true,
                    description: '知识点1的相关描述',
                },
                {
                    title: '栏目1',
                    point: false,
                    url: '资源列表',
                    description: '提交课堂作业',
                },
            ],
        }
    ];
}

const uuid = () => {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};



export default CourseAddUnit;