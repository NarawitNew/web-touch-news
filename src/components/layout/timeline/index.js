import {
  CheckOutlined,
  FileExclamationOutlined,
  FileTextOutlined,
  GlobalOutlined,
  SendOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";

import { Timeline } from "antd";
import { getDataRead } from "core/actions/collection";
import moment from "moment";
import { time } from "core/schemas/index";

const Timelines = (props) => {
  const [timeLine, setTimeLine] = useState(null);
  useEffect(() => {
    getTimeLine();
  }, [props.idNews]);

  const color = {
    Submit: "var(--link-color)",
    Approve: "var(--success-color)",
    Public: "var(--error-color)",
    Edit: "var(--warning-color)",
    Draft: "var(--primary-color)",
  };

  const iconTimeLine = {
    Submit: <SendOutlined style={{ color: "blue" }} />,
    Approve: <CheckOutlined style={{ color: "green" }} />,
    Public: <GlobalOutlined style={{ color: "red" }} />,
    Edit: <FileExclamationOutlined style={{ color: "orange" }} />,
    Draft: <FileTextOutlined style={{ color: "gray" }} />,
  };

  const dateShow = (time) => {
    const date = moment(time * 1000).format("DD/MM/YYYY HH:mm");
    return date;
  };

  const getTimeLine = () => {
    getDataRead(time, props.idNews)
      .then(function (response) {
        const data = response?.data?.timeline || "";
        if (response?.code === 200) {
          const dataMap = data.map((item, key) => {
            if (item.Role === "superadmin") {
              item = (
                <Timeline.Item
                  position="right"
                  key={key}
                  dot={iconTimeLine[item.Status]}
                >
                  <div style={{ color: color[item.Status] }}>{item.Status}</div>
                  By.{item.ByID}
                  <br />
                  {dateShow(item.Date)}
                </Timeline.Item>
              );
            } else {
              item = (
                <Timeline.Item
                  position="left"
                  key={key}
                  dot={iconTimeLine[item.Status]}
                >
                  <div style={{ color: color[item.Status] }}>{item.Status}</div>
                  By.{item.ByID}
                  <br />
                  {dateShow(item.Date)}
                </Timeline.Item>
              );
            }
            return item;
          });
          setTimeLine(dataMap);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return <Timeline mode="alternate">{timeLine}</Timeline>;
};

export default Timelines;
