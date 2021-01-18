import { Table } from 'antd'

const Tables = (props) => {
    const pagination = {
        pageSize: props.perPage,
        total: props.totalPage,
        current: props.pageCurrent
    }
    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra)
        props.setCurrentPage(pagination.current)
    }
    return (
        <>
            <Table
                pagination={false}
                columns={props.columns}
                dataSource={props.dataSource}
                scroll={{ x: 'fit-content' }}
                onChange={onChange}
                style={{ marginTop: '20px' }}
                pagination={pagination}

            />
        </>
    );
}
export default Tables