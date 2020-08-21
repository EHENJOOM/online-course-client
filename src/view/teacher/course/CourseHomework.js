import React, {Component} from 'react';
import Style from "../../view.module.css";
import {Pie, Column} from '@ant-design/charts';
import {Button, Card, Col, message, Row, Select, Statistic, Table, Tabs, Tag, Tooltip} from "antd";
import {EditOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined} from "@ant-design/icons";
import {getSubmitWorkStatisticsByWorkId, getWorkTitleByTeacherId} from "../../../api";
import Config from "../../../config/config";

const { TabPane } = Tabs;
const { Option } = Select;

class CourseHomework extends Component {

    constructor(props) {
        super(props);
        this.state = {
            workData: [
                {
                    index: 1,
                    title: '基于B/S架构的在线教育平台',
                    deadline: '2020/08/19 12:00:00',
                    publish: '1',
                }
            ],
            statistics: {
                total: 0,
                notSubmit: 0,
                checked: 0,
                chartVisible: false,
                chartData: [],
            },
            workTitle: [],
            number: localStorage.getItem("number"),
            token: localStorage.getItem("token"),
        }
    }

    componentDidMount() {
        const {number, token} = this.state;
        let courseId = this.props.match.params.id;
        getWorkTitleByTeacherId(courseId, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    let res = [];
                    for (let i = 0, length = response.data.length; i < length; i++) {
                        let temp = {
                            id: response.data[i]['id'],
                            title: response.data[i]['title'],
                        };
                        res.push(temp);
                    }
                    this.setState({workTitle: res});
                    this.updateChart(res[0].id);
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
        const {statistics} = this.state;
        return (
            <div>
                <Card title={'课程作业'} className={Style.matchHeight}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="作业管理" key="1">
                            <Button type='primary' icon={<PlusOutlined />}>添加</Button>
                            <Table className={Style.marginTop18} rowSelection={this.workRowSelection} columns={this.workColumns} dataSource={this.state.workData}/>
                        </TabPane>
                        <TabPane tab="统计分析" key="2">
                            作业题目：
                            <Select defaultValue={this.state.workTitle.length === 0 ? '' : this.state.workTitle[0].title} style={{ width: 200 }} onChange={this.handleWorkChange}>
                                {this.state.workTitle.map((item, index) => {
                                    return <Option key={index} value={item.id}>{item.title}</Option>
                                })}
                            </Select>
                            <Row gutter={16} className={Style.marginTop18}>
                                <Col span={6}>
                                    <Card>
                                        <Statistic title="未提交" value={statistics.notSubmit}  valueStyle={{ color: '#cf1322' }} suffix={' / ' + statistics.total}/>
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic title="已批阅" value={statistics.checked} valueStyle={{ color: '#3f8600' }} suffix={' / ' + statistics.total}/>
                                    </Card>
                                </Col>
                            </Row>
                            <div>
                                {
                                    statistics.chartVisible ? (
                                        <Row gutter={16} className={Style.marginTop18}>
                                            <Col span={12}>
                                                <Pie {...this.pieConfig} data={statistics.chartData}/>
                                            </Col>
                                            <Col span={12}>
                                                <Column {...this.columnConfig} data={statistics.chartData}/>
                                            </Col>
                                        </Row>
                                    ) : <></>
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="Tab 3" key="3">
                            Content of Tab Pane 3
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }

    handleWorkChange = workId => {
        this.updateChart(workId);
    }

    updateChart = workId => {
        if (workId === undefined || workId === null || workId < 1) {
            return;
        }
        const {number, token} = this.state;
        let courseId = this.props.match.params.id;
        getSubmitWorkStatisticsByWorkId(courseId, workId, number, token).then(response => {
            switch (response.code) {
                case Config.SUCCESS:
                    let res = [];
                    let total = response.data.total;
                    let checked = response.data.checked;
                    let notSubmitOrCheck = {type: '未提交或未批阅', value: 0};
                    let below60 = {type: '60分以下', value: 0};
                    let between60and70 = {type: '60~70分', value: 0};
                    let between70and80 = {type: '70~80分', value: 0};
                    let between80and90 = {type: '80~90分', value: 0};
                    let above90 = {type: '90分以上', value: 0};
                    for (let i = 0, length = response.data.list.length; i < length; i++) {
                        if (response.data.list[i] < 60) {
                            below60.value++;
                        } else if (response.data.list[i] < 70) {
                            between60and70.value++;
                        } else if (response.data.list[i] < 80) {
                            between70and80.value++;
                        } else if (response.data.list[i] < 90) {
                            between80and90.value++;
                        } else {
                            above90.value++;
                        }
                    }
                    notSubmitOrCheck.value = total - checked;
                    res.push(below60);
                    res.push(between60and70);
                    res.push(between70and80);
                    res.push(between80and90);
                    res.push(above90);
                    res.push(notSubmitOrCheck);
                    this.setState({
                        statistics: {
                            total,
                            checked,
                            notSubmit: response.data.notSubmit,
                            chartVisible: true,
                            chartData: res,
                        }});
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

    edit = (text, record) => {
        console.log(text);
        console.log(record);
    }

    workRowSelection = {
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
            this.workRowSelection = [];
        },
    }

    workColumns = [
        {
            title: '序号',
            key: 'index',
            dataIndex: 'index',
        },
        {
            title: '标题',
            key: 'title',
            dataIndex: 'title',
        },
        {
            title: '截止时间',
            key: 'deadline',
            dataIndex: 'deadline',
            render: deadline => {
                let now = new Date();
                let dead = new Date(deadline);
                let flag = false;   // false代表已经过了截止时间
                if (dead.getTime() > now.getTime()) {
                    flag = true;
                }
                return (
                    <Tooltip title={flag === true ? '未到截止日期' : '截止日期已过'} color={flag === true ? 'green' : 'red'}>
                        <Tag color={flag === true ? 'green' : 'red'}>
                            {deadline}
                        </Tag>
                    </Tooltip>
                )
            }
        },
        {
            title: '状态',
            key: 'publish',
            dataIndex: 'publish',
            render: publish => {
                return (
                    <Tag color={publish > 0 ? 'green' : 'red'}>
                        {publish > 0 ? '已发布' : '未发布'}
                    </Tag>
                )
            }
        },
        {
            title: '修改',
            key: 'edit',
            render: (text, record) => {
                return React.createElement(EditOutlined, {className: Style.edit, onClick: this.edit})
            }
        },
    ]

    columnConfig = {
        title: {
            visible: true,
            text: '作业情况柱形图',
        },
        description: {
            visible: true,
            text: '60以下：0≤x≤60，60~70：60≤x<70，70~80：70≤x<80，80~90：80≤x<90，90以上：90≤x≤100，',
        },
        forceFit: true,
        padding: 'auto',
        xField: 'type',
        yField: 'value',
        meta: {
            type: { alias: '分数区间' },
            value: { alias: '人数' },
        },
        label: {
            visible: true,
            style: {
                fill: '#0D0E68',
                fontSize: 12,
                fontWeight: 600,
                opacity: 0.6,
            },
        },
    };

    pieConfig = {
        forceFit: true,
        title: {
            visible: true,
            text: '作业情况饼图',
        },
        description: {
            visible: true,
            text: '60以下：0≤x≤60，60~70：60≤x<70，70~80：70≤x<80，80~90：80≤x<90，90以上：90≤x≤100',
        },
        radius: 0.75,
        angleField: 'value',
        colorField: 'type',
        label: {
            visible: true,
            type: 'spider',
        },
    };

}

export default CourseHomework;