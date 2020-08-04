import React, {Component} from 'react';
import {authorize} from "./api";
import Config from "./config/config";

class Student extends Component {

    componentWillMount() {
        authorize(localStorage.getItem("number"), localStorage.getItem("token")).then(response => {
            if (response.code === Config.NOT_AUTHORIZE) {
                this.props.history.push("/login");
            }
        });
    }

    render() {
        return (
            <div>
                Student界面
            </div>
        );
    }
}

export default Student;