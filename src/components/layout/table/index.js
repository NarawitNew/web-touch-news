import React, {useState} from "react";

import { Table } from 'antd'

const Tables = (props) => {
    const [order, setOrder] = useState()
    const onChange = (pagination, filters, sorter, extra) => {
        if(sorter.order !== undefined){
            console.log('sorter', sorter.order.substring(0,sorter.order.length -3))
            setOrder(sorter.order.substring(0,sorter.order.length -3))
        }
        props.setPagination({...props.pagination,
            current:pagination.current,
            sorter:order,
        })
    } 
    return (
        <>
            <Table
                loading={props.loading}
                columns={props.columns}
                dataSource={props.dataSource}
                onChange={onChange}
                style={{ marginTop: '10px' }}
                pagination={props.pagination}
                scroll={{ x: 'fit-content'}}
            />
        </>
    );
}
export default Tables