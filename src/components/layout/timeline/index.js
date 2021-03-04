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

  const dateShow = (time) => {
    const date = moment(time * 1000).format("DD/MM/YYYY HH:mm:ss ");
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
            if (item.Status === "Draft") {
              item = (
                <Timeline.Item
                  key={key}
                  dot={<FileTextOutlined style={{ color: "gray" }} />}
                  label={
                    <div style={{ color: color[item.Status] }}>
                      {item.Status}
                    </div>
                  }
                >
                  {dateShow(item.Date)}
                </Timeline.Item>
              );
            } else if (item.Status === "Submit") {
              item = (
                <Timeline.Item
                  key={key}
                  dot={<SendOutlined style={{ color: "blue" }} />}
                  label={
                    <div style={{ color: color[item.Status] }}>
                      {item.Status}
                    </div>
                  }
                >
                  {dateShow(item.Date)}
                </Timeline.Item>
              );
            } else if (item.Status === "Edit") {
              item = (
                <Timeline.Item
                  key={key}
                  dot={<FileExclamationOutlined style={{ color: "orange" }} />}
                  label={
                    <div style={{ color: color[item.Status] }}>
                      {item.Status}
                    </div>
                  }
                >
                  {dateShow(item.Date)}
                </Timeline.Item>
              );
            } else if (item.Status === "Approve") {
              item = (
                <Timeline.Item
                  key={key}
                  dot={<CheckOutlined style={{ color: "green" }} />}
                  label={
                    <div style={{ color: color[item.Status] }}>
                      {item.Status}
                    </div>
                  }
                >
                  {dateShow(item.Date)}
                </Timeline.Item>
              );
            } else if (item.Status === "Public") {
              item = (
                <Timeline.Item
                  key={key}
                  dot={<GlobalOutlined style={{ color: "red" }} />}
                  label={
                    <div style={{ color: color[item.Status] }}>
                      {item.Status}
                    </div>
                  }
                >
                  {dateShow(item.Date)}
                </Timeline.Item>
              );
            } else {
              <p>Status Empty</p>;
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

  return <Timeline mode="left">{timeLine}</Timeline>;
};

export default Timelines;
