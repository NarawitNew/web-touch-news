import { Avatar, Badge, Col, Layout, Row, Tooltip, message } from 'antd';
import { BellOutlined, ExportOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react"

import config from 'config'
import { httpClient } from 'HttpClient'

const { Header } = Layout;


const Headerbar = () => {
    const [dataUser, setDataUser] = useState({ image: '', userName: '', badge: 0 })

    useEffect(() => {
        console.log('header')
        // getData()
        const setData = localStorage.getItem('id')
        httpClient.get(config.REACT_APP_BASEURL + '/user/' + setData)
            .then(function (response) {
                const code = response.data.code
                const data = response.data.data
                console.log('data.image', data.image)
                if (code === 200) {
                    setDataUser({
                        image: data.image,
                        userName: data.firstname,
                        badge: 3
                    })
                    // console.log('Header.dataUser', dataUser)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [dataUser.image])

// console.log('dataUser.image', dataUser.image)

    const getData = () => {
        const setData = localStorage.getItem('id')
        httpClient.get(config.REACT_APP_BASEURL + '/user/' + setData)
            .then(function (response) {
                const code = response.data.code
                const data = response.data.data
                console.log('data.image', data.image)
                if (code === 200) {
                    setDataUser({
                        image: data.image,
                        userName: data.firstname,
                        badge: 3
                    })
                    // console.log('Header.dataUser', dataUser)
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
                <Col span={8}>
                    <div className="header-text">
                        touch korat news
                        </div>
                </Col>
                <Col span={8} offset={8}>
                    <Row justify="end">
                        <Col>
                            <Avatar
                                size={40}
                                src={dataUser.image}
                            />
                        </Col>
                        <Col className="header-name">{dataUser.userName}</Col>
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