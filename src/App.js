import React from 'react';
import {Button, ConfigProvider} from "antd";
import 'antd/dist/antd.less';
import zhCN from "antd/es/locale/zh_CN";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Student from "./Student";
import Teacher from "./Teacher";
import {commonRoutes} from "./routers";
import {createHashHistory} from "history";

const history = createHashHistory();

function App() {
  return (
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
      </ConfigProvider>
  );
}

export default App;
