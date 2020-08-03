import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import Student from './Student';
import Teacher from './Teacher';
import zhCN from "antd/es/locale/zh_CN";
import * as serviceWorker from './serviceWorker';
import {ConfigProvider} from "antd";
import {HashRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import {commonRoutes} from "./routers";
import 'antd/dist/antd.less';
import {Login} from "./view";

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
      <Router>
          <Switch>
              <Route path={'/student'} render={rootProps => {
                  // 授权检测
                  if (!localStorage.getItem("token")) {
                      rootProps.history.push('/login');
                  }
                  return <Student {...rootProps}/>
              }}/>
              {/*<Route path={'/admin'} render={rootProps => {

              }}/>*/}
              <Route path={'/teacher'} render={rootProps => {
                  return <Teacher {...rootProps}/>
              }}/>
              {commonRoutes.map((item, index) => {
                  return <Route key={item.pathname} path={item.pathname} component={item.component}/>
              })}
              <Redirect from={"/"} to={"/login"}/>
              <Redirect to={"/404"}/>
          </Switch>
      </Router>
  </ConfigProvider> ,
  document.getElementById('root')
);

serviceWorker.unregister();
