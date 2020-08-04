import React, {Component} from 'react';
import Style from '../component.module.css';
import {Spin} from "antd";

class Loading extends Component {
    render() {
        return (
            <div className={[Style.matchParent, Style.flex].join(" ")}>
                <div className={Style.center}>
                    <Spin />
                </div>
            </div>
        );
    }
}

export default Loading;