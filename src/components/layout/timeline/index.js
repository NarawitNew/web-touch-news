import {
  CheckOutlined,
  FileExclamationOutlined,
  FileTextOutlined,
  GlobalOutlined,
  SendOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";

import { Timeline } from "antd";
import config from "config";
import { httpClient } from "HttpClient";
import moment from "moment";

const Timelines = (props) => {
  const [timeLine, setTimeLine] = useState(null);
  useEffect(() => {
    getTimeLine();
  }, [props.idNews]);

  const color = {
    Submit: "blue",
    Approve: "#73d13d",
    Public: "red",
    Edit: "orange",
    Draft: "grey",
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
    httpClient
      .get(config.REACT_APP_BASEURL + "/news/timeline/" + props.idNews)
      .then(function (response) {
        const code = response.data.code;
        const data = response.data.data.timeline;
        if (code === 200) {
          const dataMap = data.map((item, key) => {
            if (item.Role === "superadmin") {
              item = (
                <Timeline.Item
                  position="right"
                  key={key}
                  dot={iconTimeLine[item.Status]}
                  label={
                    <div style={{ color: color[item.Status] }}>
                      {item.Status}
                    </div>
                  }
                >
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
                  label={
                    <div style={{ color: color[item.Status] }}>
                      {item.Status}
                    </div>
                  }
                >
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
