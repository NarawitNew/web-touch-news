import { CheckOutlined, EditOutlined, FileTextOutlined, GlobalOutlined, SendOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";

import { Timeline } from 'antd'
import config from 'config'
import { httpClient } from 'HttpClient'

const Timelines = (props) => {
    const [timeLine, setTimeLine] = useState(null)
    useEffect(() => {
        getTimeLine()
    },[props.idNews])

    const getTimeLine = () => {
        httpClient.get(config.REACT_APP_BASEURL + '/news/timeline/' + props.idNews)
            .then(function (response) {
                console.log('timeline', response)
                const code = response.data.code
                const data = response.data.data.timeline
                if(code === 200){
                    const dataMap = data.map((item,key)=>{
                        if(item.Status === 'ร่าง'){
                            item =  <Timeline.Item key={key} dot={<FileTextOutlined style={{ color: 'gray' }} />} label={item.Status}>{item.Date}</Timeline.Item>
                        }else if(item.Status === 'ส่ง'){
                            item = <Timeline.Item  key={key} dot={<SendOutlined style={{ color: 'blue' }} />} label={item.Status}>{item.Date}</Timeline.Item>
                        }else if(item.Status === 'ขอแก้ไข'){
                            item = <Timeline.Item  key={key} dot={<EditOutlined style={{ color: 'orange' }} />} label={item.Status}>{item.Date}</Timeline.Item>
                        }else if(item.Status === 'อนุมัติ'){
                            item = <Timeline.Item  key={key} dot={<CheckOutlined style={{ color: 'green' }} />} label={item.Status}>{item.Date}</Timeline.Item>
                        }else if(item.Status === 'สาธารณะ'){
                            item = <Timeline.Item  key={key} dot={<GlobalOutlined style={{ color: 'red' }} />} label={item.Status}>{item.Date}</Timeline.Item>
                        }else{
                            // item = <Timeline.Item  key={key} >ผิดพลาด</Timeline.Item>
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
        </Timeline>
    );
}
export default Timelines