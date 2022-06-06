import {
  AutoComplete,
  Breadcrumb,
  Button,
  Col,
  Form,
  Image,
  Input,
  Layout,
  Row,
  Select,
  Spin,
  Tooltip,
  Upload,
  message,
} from "antd";
import { HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  categoryList,
  hashtagList,
  imageSave,
  imageUpLoad,
  news,
  newsRead,
  newsUpdate,
} from "core/schemas/index";
import {
  getDataList,
  getDataRead,
  postData,
  postIamge,
  putData,
} from "core/actions/collection";

import FormData from "form-data";
import { Froala } from "components/layout/froala/index";
import { Link } from "react-router-dom";
import Tag from "components/layout/tag/index";
import imgError from "assets/image/img_error2.png";

const { Content } = Layout;
const { Option } = Select;

const CreateNews = (props) => {
  const params = props.match.params;
  const [form] = Form.useForm();
  const [category, setCategory] = useState([]);
  const [credit, setCredit] = useState({ inputValue: "", tags: [] });
  const [hashtag, setHashtag] = useState({ inputValue: "", tags: [] });
  const [hashtagSource, setHashtagSource] = useState(null);
  const [image, setImage] = useState(imgError);
  const [spinningImage, setSpinningImage] = useState(false);
  const [newsContent, setNewsContent] = useState("");
  const [imageContent, setImageContent] = useState([]);
  const [cause, setCause] = useState("");

  useEffect(() => {
    getCategory();
    getHashtag();
    if (params.type === "edit") getData();
  }, [props.location.pathname]);

  const getData = () => {
    getDataRead(newsRead, params.id)
      .then((response) => {
        const { code, data } = response || "";
        if (code === 200) {
          form.setFieldsValue({
            topic: data.topic,
            category: data.category,
          });
          setNewsContent(data.content);
          setImage(data.image);
          setCause(data.cause);
          setCredit({
            tags: data.credit,
            inputValue: "",
          });
          setHashtag({
            tags: data.hashtag,
            inputValue: "",
          });
        } else {
          setCredit({ tags: [] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCategory = () => {
    getDataList(categoryList)
      .then((response) => {
        const data = response?.data?.data_list || "";
        const code = response?.code || "";
        if (code === 200) {
          const dataMap = data.map((item) => {
            item = (
              <Option key={item.id} value={item.category}>
                {item.category}
              </Option>
            );
            return item;
          });
          setCategory(dataMap);
        } else {
          setCategory([]);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getHashtag = () => {
    getDataList(hashtagList)
      .then(function (response) {
        const { code, data } = response || "";
        if (code === 200) {
          const dataMap = data?.map((item) => {
            item = { value: item };
            return item;
          });
          setHashtagSource(dataMap);
        } else {
          setHashtagSource([]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const saveIamge = (schemas, data) => {
    postIamge(schemas, data)
      .then(function (response) {
        const { status, data } = response || "";
        if (status === 200) {
          setImage(data.url);
          setSpinningImage(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const uploadImage = (option) => {
    setSpinningImage(true);
    let setData = new FormData();
    setData.append("sampleFile", option.file);
    setData.append("save", false);
    saveIamge(imageUpLoad, setData);
  };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      const setData = JSON.stringify({
        category: values.category,
        topic: values.topic,
        content: newsContent,
        image: image,
        credit: credit.tags,
        hashtag: hashtag.tags,
        status: "Draft",
      });
      params.type === "create"
        ? postData(news, setData)
            .then(function (response) {
              if (response?.code === 201) {
                message.success(response?.message);
                let setData = new FormData();
                setData.append("url", image);
                saveIamge(imageSave, setData);
                if (imageContent !== undefined) {
                  imageContent.map((item) => {
                    let setData = new FormData();
                    setData.append("url", item);
                    saveIamge(imageSave, setData);
                    return item;
                  });
                }
                props.history.push(`/home/view/${response?.data}`);
              }
            })
            .catch(function (error) {
              console.log(error);
            })
        : putData(newsUpdate, params.id, setData)
            .then(function (response) {
              if (response?.code === 200) {
                message.success(response?.message);
                let setData = new FormData();
                setData.append("url", image);
                saveIamge(imageSave, setData);
                if (imageContent !== undefined) {
                  imageContent.map((item) => {
                    let setData = new FormData();
                    setData.append("url", item);
                    saveIamge(imageSave, setData);
                    return item;
                  });
                }
                props.history.push(`/home/view/${params.id}`);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const creditClose = (removedTag) => {
    const tags = credit.tags.filter((tag) => tag !== removedTag);
    setCredit({ tags });
  };

  const creditConfirm = () => {
    let tags = [...credit.tags];
    tags.push(credit.inputValue);
    setCredit({
      tags,
      inputValue: "",
    });
  };

  const hashtagClose = (removedTag) => {
    const tags = hashtag.tags.filter((tag) => tag !== removedTag);
    setHashtag({
      tags,
      inputValue: "",
    });
  };

  const hashtagConfirm = () => {
    let tags = [...hashtag.tags];
    tags.push(hashtag.inputValue);
    setHashtag({
      tags,
      inputValue: "",
    });
  };

  const onErrorImg = (e) => {
    e.target.src = imgError;
  };

  return (
    <>
      <Breadcrumb style={{ margin: "4px 0" }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
        <Breadcrumb.Item>
          {params.type === "create" ? "เพิ่ม" : "แก้ไข"}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Content className="create-content">
        <Form form={form} layout="vertical">
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={10}>
              <Row gutter={[0, 0]} justify="center">
                <Col span={14}>
                  <Spin spinning={spinningImage}>
                    <Image width={"100%"} src={image} onError={onErrorImg} />
                  </Spin>
                </Col>
              </Row>
              <Row gutter={[0, 0]} justify="center">
                <Col>
                  <div style={{ color: "var(--gray-color)" }}>
                    อัตราส่วนภาพ 1:1 ขนาด 1080x1080 px
                  </div>
                </Col>
              </Row>
              <Row gutter={[0, 16]} justify="center">
                <Col>
                  <Upload
                    listType="picture"
                    customRequest={uploadImage}
                    showUploadList={false}
                  >
                    <Button>อัพโหลดรูปภาพ</Button>
                  </Upload>
                </Col>
              </Row>
              <Row gutter={[8, 8]} align="middle" style={{ marginTop: "20px" }}>
                <Col style={{ textAlign: "right" }} span={5}>
                  <div>เครติด</div>
                </Col>
                <Col span={16}>
                  <Input
                    value={credit.inputValue}
                    onChange={(e) =>
                      setCredit({ ...credit, inputValue: e.target.value })
                    }
                    onPressEnter={creditConfirm}
                  />
                </Col>
                <Col span={2}>
                  <Tooltip placement="bottom" title="เพิ่มเครติด">
                    <PlusCircleOutlined
                      className="create-icon"
                      onClick={creditConfirm}
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Row gutter={[8, 16]} align="middle">
                <Col offset={5}>
                  <Tag data={credit.tags} onClose={creditClose} />
                </Col>
              </Row>
              <Row gutter={[8, 8]} align="middle">
                <Col style={{ textAlign: "right" }} span={5}>
                  <div>แฮชแท็ก</div>
                </Col>
                <Col span={16}>
                  <Input.Group>
                    <AutoComplete
                      style={{ width: "100%" }}
                      value={hashtag.inputValue}
                      onChange={(inputValue) =>
                        setHashtag({
                          ...hashtag,
                          inputValue: inputValue,
                        })
                      }
                      options={hashtagSource}
                      filterOption={(inputValue, option) =>
                        option.value
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                  </Input.Group>
                </Col>
                <Col span={2}>
                  <Tooltip placement="bottom" title="เพิ่มแฮชแท็ก">
                    <PlusCircleOutlined
                      onClick={hashtagConfirm}
                      className="create-icon"
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Row gutter={[8, 16]} align="middle">
                <Col offset={5}>
                  <Tag data={hashtag.tags} onClose={hashtagClose} />
                </Col>
              </Row>
              {params.type === "edit" ? (
                <Row gutter={[8, 8]}>
                  <Col style={{ textAlign: "right" }} span={5}>
                    <div>สิ่งที่ควรแก้ไข</div>
                  </Col>
                  <Col span={17}>
                    <div style={{ color: "var(--error-color)" }}>
                      คำแนะนำจาก Super Admin
                    </div>
                    <div>{cause}</div>
                  </Col>
                </Row>
              ) : null}
            </Col>
            <Col
              xs={{ span: 18, offset: 3 }}
              sm={{ span: 18, offset: 3 }}
              md={{ span: 18, offset: 3 }}
              lg={{ span: 18, offset: 3 }}
              xl={{ span: 14, offset: 0 }}
            >
              <Form.Item
                label="ประเภทข่าว"
                name="category"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Select placeholder="เลือกประเภท">{category}</Select>
              </Form.Item>
              <Form.Item
                label="หัวเรื่อง"
                name="topic"
                rules={[{ required: true, message: "กรุณาใส่ข้อมูล" }]}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item label="เนื้อหาข่าว">
                <Froala
                  onModelChange={(html) => setNewsContent(html)}
                  setImageContent={setImageContent}
                  mode={newsContent}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Button
              className="create-button"
              type="primary"
              ghost
              onClick={submit}
            >
              บันทึก
            </Button>
            <Link to="/home">
              <Button className="create-button">ยกเลิก</Button>
            </Link>
          </Row>
        </Form>
      </Content>
    </>
  );
};

export default CreateNews;
