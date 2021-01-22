import React, { useEffect, useState } from "react"

import { Tag } from 'antd';

const Tags = (props) => {
    const data = props.data;
return(
    <>
    {data.map((data,i) => {
        return(<Tag key={i}>
            {data}
        </Tag>);
    })}
    </>
);

}
export default Tags