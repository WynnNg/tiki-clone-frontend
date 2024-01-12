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
  putUpdateBook,
} from "../../../utils/api";
import { v4 as uuidv4 } from "uuid";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ModalUpdateBook(props) {
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
  const [initFileForm, setInitFileForm] = useState({});
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [previewSlider, setPreviewSlider] = useState("");
  const [fileListThumbnail, setFileListThumbnail] = useState([]);
  const [fileListSlider, setFileListSlider] = useState([]);
  const { isModalOpen, setIsModalOpen, fetchListBooks, dataBookUpdate } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBookCategory();
  }, []);

  useEffect(() => {
    if (dataBookUpdate) {
      handleFileList();
      if (isModalOpen) {
        form.setFieldsValue({
          mainText: dataBookUpdate.mainText,
          author: dataBookUpdate.author,
          price: dataBookUpdate.price,
          category: dataBookUpdate.category,
          quantity: dataBookUpdate.quantity,
          sold: dataBookUpdate.sold,
        });
      }
    }
    return () => {
      if (form) {
        form.resetFields();
      }
    };
  }, [dataBookUpdate]);

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

  const handleFileList = () => {
    if (dataBookUpdate) {
      let imgThumbnail = [],
        imgSlider = [];
      if (dataBookUpdate.thumbnail) {
        imgThumbnail = [
          {
            uid: uuidv4(),
            name: dataBookUpdate.thumbnail,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
              dataBookUpdate.thumbnail
            }`,
          },
        ];
        setFileListThumbnail(imgThumbnail);
        setDataThumbnail(imgThumbnail);
      }
      if (dataBookUpdate.slider) {
        imgSlider = dataBookUpdate.slider.map((item) => {
          return {
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          };
        });
        setFileListSlider(imgSlider);
        setDataSlider(imgSlider);
      }
    }
  };

  const handleFileUploadThumbnail = async ({ file, onSuccess, onError }) => {
    setLoadingThumbnail(true);
    let res = await postUploadBookImg(file);

    if (res && res.data) {
      setLoadingThumbnail(false);
      setDataThumbnail([
        {
          uid: file.uid,
          name: res.data.fileUploaded,
        },
      ]);
      onSuccess("Ok");
    } else {
      onError("Opp! Something went wrong");
    }
  };

  const handleFileUploadSlider = async ({ file, onSuccess, onError }) => {
    setLoadingSlider(true);
    let res = await postUploadBookImg(file);

    if (res && res.data) {
      setLoadingSlider(false);
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          uid: file.uid,
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
      let newData = dataSlider.filter((item) => item.uid !== file.uid);
      setDataSlider(newData);
    }
  };

  const handleChangeThumbnail = ({ fileList: newFileList }) =>
    setFileListThumbnail(newFileList);

  const handlePreviewThumbnail = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewThumbnail(file.url || file.preview);
    setPreviewOpenThumbnail(true);
    setPreviewTitleThumbnail(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancelThumbnail = () => {
    setPreviewOpenThumbnail(false);
  };

  const handleChangeSlider = ({ fileList: newFileList }) =>
    setFileListSlider(newFileList);

  const handlePreviewSlider = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewSlider(file.url || file.preview);
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

    let res = await putUpdateBook(dataBookUpdate._id, dataBook)
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
      message.success("Cập nhập sách thành công");
      setDataSlider([]);
      setDataThumbnail([]);
      await fetchListBooks();
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title="Cập nhập thông tin sách"
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
                  onChange={handleChangeThumbnail}
                  onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                  fileList={fileListThumbnail}
                >
                  {uploadButtonThumbnail}
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
                    src={previewThumbnail}
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

                  onChange={handleChangeSlider}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  fileList={fileListSlider}
                >
                  {uploadButtonSlider}
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
                    src={previewSlider}
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
