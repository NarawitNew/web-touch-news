import { CheckOutlined, EditOutlined, FileTextOutlined, GlobalOutlined, SendOutlined } from '@ant-design/icons';

import {Timeline} from 'antd'

const Timelines = () => {
    return (
        <Timeline mode="left">
            <Timeline.Item dot={<FileTextOutlined style={{ color: 'gray' }} />} label="ร่าง">12/1/2021</Timeline.Item>
            <Timeline.Item dot={<EditOutlined style={{ color: 'orange' }} />} label="แก้ไข">12/1/2021</Timeline.Item>
            <Timeline.Item dot={<SendOutlined style={{ color: 'blue' }} />} label="ส่ง">12/1/2021</Timeline.Item>
            <Timeline.Item dot={<CheckOutlined style={{ color: 'green' }} />} label="อนุมัติ">12/1/2021</Timeline.Item>
            <Timeline.Item dot={<GlobalOutlined style={{ color: 'red' }} />} label="สาธารณะ">12/1/2021</Timeline.Item>
        </Timeline>
    );
}
export default Timelines