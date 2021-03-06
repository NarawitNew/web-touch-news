import config from 'config'
import axios from 'axios'
import sha256 from 'js-sha256'
import FormData from 'form-data'
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';

const Login = (props) => {
    const [username, setUsername] = useState((localStorage.getItem('checkbox') ? localStorage.getItem('email') : ''))
    const [password, setPassword] = useState((localStorage.getItem('checkbox') ? localStorage.getItem('password') : ''))
    const [isCheckbox, setIsCheckbox] = useState((localStorage.getItem('checkbox')=== 'true' ? true : false))
    
    console.log('isCheckbox', isCheckbox)
    const onFinish = values => {
        if (isCheckbox && values.username !== "") {
            localStorage.setItem('email', values.username)
            localStorage.setItem('password', values.password)
            localStorage.setItem('checkbox', isCheckbox)
        }else if(isCheckbox === false){
            localStorage.setItem('email', '')
            localStorage.setItem('password', '')
            localStorage.setItem('checkbox', isCheckbox)
        }
        // const params = {
        //     email: values.username,
        //     password: values.password,
        //     role: 'admin',
        //     service: 'timelapse-service'
        // }
        let setData = new FormData();
        setData.append('email', values.username);
        setData.append('password', sha256.hmac("sil-dkigx]ujpocx]'my=", values.password));
        setData.append('role', 'admin');
        setData.append('service', 'timelapse-service');

        axios.post(`${config.authanURL}/login`, setData)
            .then(function (response) {
                // console.log('response', response.data.code)
                if (response.data.code === 200) {
                    message.success(response.data.message)
                    localStorage.setItem('token', response.data.data.access_token)
                    props.history.push("/home")
                    window.location.reload()
                } else {
                    message.error(response.data.message)
                }
                // console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const onCheckbox = (e) => {
        setIsCheckbox(e.target.checked)
    }
    return (
        <div className="Login">
            <div className="Login-box">
                <div className="Login-herde">
                    T<p style={{ display: "inline-block", color: "#216258" }}>o</p>uch K<p style={{ display: "inline-block", color: "#216258" }}>o</p>rat News
                </div>

                <div className="Login-form">
                    <Form
                        initialValues={{ username: username, password: password }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{  message: 'Please input your username!' }]}
                        >
                            <Input value="s" size="large" placeholder="???????????????????????????????????????" prefix={<UserOutlined />}
                                onChange={e => setUsername(e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password size="large" placeholder="????????????????????????" prefix={<UnlockOutlined />}
                                onChange={e => setPassword(e.target.value)} />
                        </Form.Item>
                        <Form.Item name="isCheckbox" >
                            <Checkbox checked={isCheckbox} onChange={onCheckbox}>??????????????????????????????????????????</Checkbox>
                        </Form.Item>
                        <Form.Item >
                            <div className="Login-button">
                                <Button size="large" type="primary" htmlType="submit" block>
                                    ?????????????????????????????????
                            </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default Login;
