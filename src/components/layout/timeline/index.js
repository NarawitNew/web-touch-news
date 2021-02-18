import { CheckOutlined, EditOutlined, FileTextOutlined, GlobalOutlined, SendOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";

import { Timeline } from 'antd'
import config from 'config'
import { httpClient } from 'HttpClient'

const Timelines = (props) => {
    const [timeLine, setTimeLine] = useState(null)
    useEffect(() => {
        getTimeLine()
    },[timeLine!==null])

    const getTimeLine = () => {
        httpClient.get(config.REACT_APP_BASEURL + '/news/timeline/' + props.idNews)
            .then(function (response) {
                console.log('response', response)
                const code = response.data.code
                const data = response.data.data.status
                if(code === 200){
                    const dataMap = data.map((item,key)=>{
                        if(item.Status === 'ร่าง'){
                            item =  <Timeline.Item key={key} dot={<FileTextOutlined style={{ color: 'gray' }} />} label="ร่าง">{item.Date}</Timeline.Item>
                        }else if(item.Status === 'ส่ง'){
                            item = <Timeline.Item  key={key} dot={<SendOutlined style={{ color: 'blue' }} />} label="ส่ง">{item.Date}</Timeline.Item>
                        }else if(item.Status === 'แก้ไข'){
                            item = <Timeline.Item  key={key} dot={<EditOutlined style={{ color: 'orange' }} />} label="ส่ง">{item.Date}</Timeline.Item>
                        }else if(item.Status === 'อนุมัติ'){
                            item = <Timeline.Item  key={key} dot={<CheckOutlined style={{ color: 'green' }} />} label="ส่ง">{item.Date}</Timeline.Item>
                        }else if(item.Status === 'สาธารณะ'){
                            item = <Timeline.Item  key={key} dot={<GlobalOutlined style={{ color: 'red' }} />} label="ส่ง">{item.Date}</Timeline.Item>
                        }
                    return item
                    })
                    setTimeLine(dataMap)

                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <Timeline mode="left">
            {timeLine}
            {/* <Timeline.Item dot={<FileTextOutlined style={{ color: 'gray' }} />} label="ร่าง">12/1/2021</Timeline.Item>
            <Timeline.Item dot={<EditOutlined style={{ color: 'orange' }} />} label="แก้ไข">12/1/2021</Timeline.Item>
            <Timeline.Item dot={<SendOutlined style={{ color: 'blue' }} />} label="ส่ง">12/1/2021</Timeline.Item>
            <Timeline.Item dot={<CheckOutlined style={{ color: 'green' }} />} label="อนุมัติ">12/1/2021</Timeline.Item>
            <Timeline.Item dot={<GlobalOutlined style={{ color: 'red' }} />} label="สาธารณะ">12/1/2021</Timeline.Item> */}
        </Timeline>
    );
}
export default Timelines