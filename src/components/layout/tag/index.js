import React from "react";
import { Tag } from "antd";

const Tags = (props) => {
  const data = props.data;
  return (
    <>
      {data.map((data, i) => {
        return (
          <Tag
            key={i}
            closable
            onClose={(e) => {
              e.preventDefault();
              props.onClose(data);
            }}
          >
            {data}
          </Tag>
        );
      })}
    </>
  );
};

export default Tags;
