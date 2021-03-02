import { Button, Checkbox, Form, Input, message } from 'antd';
import React, { useContext, useState } from "react";
import { UnlockOutlined, UserOutlined } from '@ant-design/icons';

import { Context } from '../../context'
import axios from 'axios'
import config from 'config'

const Login = (props) => {
    const context = useContext(Context)
    const [username] = useState((localStorage.getItem('checkbox') ? localStorage.getItem('email') : ''))
    const [password] = useState((localStorage.getItem('checkbox') ? localStorage.getItem('password') : ''))
    const [isCheckbox, setIsCheckbox] = useState((localStorage.getItem('checkbox') === 'true' ? true : false))
    const onFinish = values => {
        if (isCheckbox && values.username !== "") {
            localStorage.setItem('email', values.username)
            localStorage.setItem('password', values.password)
            localStorage.setItem('checkbox', isCheckbox)
        } else if (isCheckbox === false) {
            localStorage.setItem('email', '')
            localStorage.setItem('password', '')
            localStorage.setItem('checkbox', isCheckbox)
        }

        const setData = JSON.stringify({
            "email": `${values.username}`,
            "password": `${values.password}`
        })
        axios.post(config.REACT_APP_BASEURL + '/login', setData)
            .then(function (response) {
                console.log('response', response)
                if (response.data.code === 200) {
                    console.log('login_context.user', context.user)
                    console.log('response.data.data.first_name', response.data.data.first_name)
                    localStorage.setItem('refresh_token', response.data.data.refresh_token)
                    localStorage.setItem('access_token', response.data.data.access_token)
                    localStorage.setItem('role', response.data.data.role)
                    localStorage.setItem('id', response.data.data.id)

                    message.success(response.data.message)
                    console.log('response.data.message', response.data.message)
                    props.history.push("/home")
                    window.location.reload()
                } else {
                    message.error(response.data.message)
                }
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
                    T<p className="login-text-o" >o</p>uch K<p className="login-text-o">o</p>rat News
                </div>

                <div className="Login-form">
                    <Form
                        initialValues={{ username: username, password: password }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input value="s" size="large" placeholder="ชื่อผู้ใช้งาน" prefix={<UserOutlined />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password size="large" placeholder="รหัสผ่าน" prefix={<UnlockOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="isCheckbox" >
                            <Checkbox checked={isCheckbox} onChange={onCheckbox}>บันทึกรหัสผ่าน</Checkbox>
                        </Form.Item>
                        <Form.Item >
                            <div className="Login-button">
                                <Button size="large" type="primary" htmlType="submit" block>
                                    เข้าสู่ระบบ
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
