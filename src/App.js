import Content from 'components/router/index';
import Header from 'components/layout/header/index';
import { Layout } from 'antd';
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sider from 'components/layout/sider/index';

function App() {
  return (
    <Layout breakpoint='lg' style={{ minHeight: '100vh' }} >
      <Header></Header>
      <Layout>
      <Router>
        <Sider></Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content></Content>
        </Layout>
        </Router>
      </Layout>
    </Layout>
  );
}
export default App;
