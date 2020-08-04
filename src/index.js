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
import {createHashHistory} from "history";

const history = createHashHistory();

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
      <Router history={history}>
          <Switch>
              <Route path={'/student'} render={rootProps => {
                  return <Student {...rootProps}/>;
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
