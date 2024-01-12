import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
  Upload,
  notification,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getBookCategory,
  postCreateBook,
  postUploadBookImg,
} from "../../../utils/api";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function ModalAddBook(props) {
  const [bookCategory, setBookCategory] = useState([]);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [imageUrlThumbnail, setImageUrlThumbnail] = useState();
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [imageUrlSlider, setImageUrlSlider] = useState();
  const [previewOpenThumbnail, setPreviewOpenThumbnail] = useState(false);
  const [previewTitleThumbnail, setPreviewTitleThumbnail] = useState();
  const [previewOpenSlider, setPreviewOpenSlider] = useState(false);
  const [previewTitleSlider, setPreviewTitleSlider] = useState();
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const { isModalOpen, setIsModalOpen, fetchListBooks } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBookCategory();
  }, []);

  const fetchBookCategory = async () => {
    let res = await getBookCategory();
    if (res.data) {
      let dataCategory = [];
      res.data.map((item) => {
        return dataCategory.push({
          value: item,
          label: item,
        });
      });
      setBookCategory(dataCategory);
    }
  };

  const handleFileUploadThumbnail = async ({ file, onSuccess, onError }) => {
    let res = await postUploadBookImg(file);

    if (res && res.data) {
      setDataThumbnail([
        {
          id: file.uid,
          name: res.data.fileUploaded,
        },
      ]);
      onSuccess("Ok");
    } else {
      onError("Opp! Something went wrong");
    }
  };

  const handleFileUploadSlider = async ({ file, onSuccess, onError }) => {
    let res = await postUploadBookImg(file);

    if (res && res.data) {
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          id: file.uid,
          name: res.data.fileUploaded,
        },
      ]);
      onSuccess("Ok");
    } else {
      onError("Opp! Something went wrong");
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail({});
    }
    if (type === "slider") {
      let newData = dataSlider.filter((item) => item.id !== file.uid);
      setDataSlider(newData);
    }
  };

  const handleChangeThumbnail = (info) => {
    if (info.file.status === "uploading") {
      setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      let urlThumbnail = URL.createObjectURL(info.file.originFileObj);

      setLoadingThumbnail(false);
      setImageUrlThumbnail(urlThumbnail);
    }
  };

  const handlePreviewThumbnail = async (file) => {
    setPreviewOpenThumbnail(true);
    setPreviewTitleThumbnail(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancelThumbnail = () => {
    setPreviewOpenThumbnail(false);
  };

  const handleChangeSlider = (info) => {
    if (info.file.status === "uploading") {
      setLoadingSlider(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      let urlSlider = URL.createObjectURL(info.file.originFileObj);

      setLoadingSlider(false);
      setImageUrlSlider(urlSlider);
    }
  };

  const handlePreviewSlider = async (file) => {
    setPreviewOpenSlider(true);
    setPreviewTitleSlider(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancelSlider = () => {
    setPreviewOpenSlider(false);
  };

  const uploadButtonThumbnail = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const uploadButtonSlider = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const onFinish = async (values) => {
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "Thiếu ảnh Thumbnail",
        description: "Vui lòng upload ảnh thumbnail cho sách",
      });
      return;
    }
    if (dataSlider.length === 0) {
      notification.error({
        message: "Thiếu ảnh Slider",
        description: "Vui lòng upload ít nhất 1 ảnh slider",
      });
      return;
    }
    const { mainText, author, price, sold, quantity, category } = values;
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);
    const dataBook = {
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category,
    };

    let res = await postCreateBook(dataBook)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        notification.open({
          message: "Opps! Something went wrong",
          description: error.message,
          icon: <WarningTwoTone twoToneColor="red" />,
        });
      });
    if (res && res.data) {
      message.success("Tạo mới sách thành công");
      form.resetFields();
      setDataSlider([]);
      setDataThumbnail([]);
      await fetchListBooks();
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title="Thêm mới sách"
        open={isModalOpen}
        width="50vw"
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Divider />
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                label="Tên sách"
                rules={[{ required: true, message: "Bạn chưa điền tên sách" }]}
                name="mainText"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tác giả"
                rules={[
                  { required: true, message: "Bạn chưa điền tên tác giả" },
                ]}
                name="author"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={15}>
            <Col span={6}>
              <Form.Item
                label="Giá tiền"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá tiền",
                  },
                ]}
                name="price"
              >
                <InputNumber addonAfter="VND" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Thể loại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thể loại sách",
                  },
                ]}
                name="category"
              >
                <Select
                  //   defaultValue="lucy"
                  // onChange={handleChange}
                  allowClear
                  showSearch
                  options={bookCategory}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Số lượng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng sách",
                  },
                ]}
                name="quantity"
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Đã bán"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số sách đã bán",
                  },
                ]}
                name="sold"
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item>
                <div>Ảnh Thumbnail</div>

                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleFileUploadThumbnail}
                  onPreview={handlePreviewThumbnail}
                  showUploadList={true}
                  maxCount={1}
                  // action={(info) => URL.createObjectURL(info.file.originFileObj)}
                  beforeUpload={beforeUpload}
                  onChange={handleChangeThumbnail}
                  onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                >
                  {imageUrlThumbnail
                    ? (
                        <img
                          src={imageUrlThumbnail}
                          alt="avatar"
                          style={{
                            width: "100%",
                          }}
                        />
                      ) && uploadButtonThumbnail
                    : uploadButtonThumbnail}
                </Upload>
                <Modal
                  open={previewOpenThumbnail}
                  title={previewTitleThumbnail}
                  footer={null}
                  onCancel={handleCancelThumbnail}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={imageUrlThumbnail}
                  />
                </Modal>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <div>Ảnh Slider</div>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  onPreview={handlePreviewSlider}
                  customRequest={handleFileUploadSlider}
                  showUploadList={true}
                  multiple
                  // action={(info) => URL.createObjectURL(info.file.originFileObj)}
                  beforeUpload={beforeUpload}
                  onChange={handleChangeSlider}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                >
                  {imageUrlSlider
                    ? (
                        <img
                          src={imageUrlSlider}
                          alt="avatar"
                          style={{
                            width: "100%",
                          }}
                        />
                      ) && uploadButtonSlider
                    : uploadButtonSlider}
                </Upload>
                <Modal
                  open={previewOpenSlider}
                  title={previewTitleSlider}
                  footer={null}
                  onCancel={handleCancelSlider}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={imageUrlSlider}
                  />
                </Modal>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
