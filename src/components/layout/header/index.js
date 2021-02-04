import { Avatar, Badge, Col, Layout, Row, Tooltip, message } from 'antd';
import { BellOutlined, ExportOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from "react"

import { Context } from '../../../context'
import config from 'config'
import { httpClient } from 'HttpClient'

const { Header } = Layout;


const Headerbar = () => {
    const context = useContext(Context)
    const user = context.user
    // console.log('user', user)
    const [dataUser, setDataUser] = useState({ image: '', firstname: '', badge: null })

    useEffect(() => {
        getData()
    }, [user.firstname,user.lastname,user.image])

    const getData = () => {
        const setData = localStorage.getItem('id')
        // console.log('header_getData')
        httpClient.get(config.REACT_APP_BASEURL + '/user/' + setData)
            .then(function (response) {
                const code = response.data.code
                const data = response.data.data
                if (code === 200) {
                    setDataUser({
                        image: data.image,
                        firstname: data.firstname,
                        badge:2
                    })
                    context.setData({
                      email: data.email,
                      image: data.image,
                      firstname:data.firstname,
                      lastname:data.lastname,
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const onLogout = () => {
        const setData = JSON.stringify({
            "id": localStorage.getItem('id')
        })
        httpClient.post(config.REACT_APP_BASEURL + '/logout', setData)
            .then(function (response) {
                const code = response.data.code
                if (code === 200) {
                    localStorage.setItem('token', '')
                    localStorage.setItem('role', '')
                    localStorage.setItem('id', '')
                    localStorage.setItem('first_name', '')

                    message.success('ออกจากระบบสำเร็จ');
                    window.location.reload()
                } else {
                }
            })
            .catch(function (error) {
                console.log(error);

            });
    }
    return (
        <Header className="header">
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="header-text">
                        touch korat news
                        </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row justify="end">
                        <Col>
                            <Avatar
                                size={40}
                                src={dataUser.image}
                            />
                        </Col>
                        <Col className="header-name">{dataUser.firstname}</Col>
                        <Col className="header-col-icon">
                            <Badge count={dataUser.badge} size="small">
                                <BellOutlined className="header-icon" />
                            </Badge>
                        </Col>
                        <Col>
                            <Tooltip placement="bottomRight" title="ออกจากระบบ" >
                                <ExportOutlined className="header-icon" onClick={onLogout} />
                            </Tooltip>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Header>
    );
}
export default Headerbar