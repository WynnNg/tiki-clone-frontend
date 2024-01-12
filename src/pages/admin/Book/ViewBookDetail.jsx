import React, { useEffect, useState } from "react";
import { Button, Drawer, Descriptions, Upload, Modal, Divider } from "antd";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { NumericFormat } from "react-number-format";

export default function ViewBookDetail(props) {
  const { open, setOpen, dataBookDetail, setDataBookDetail } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    handleFileList();
  }, [dataBookDetail]);

  const handleFileList = () => {
    if (dataBookDetail) {
      let imgThumbnail = {},
        imgSlider = [];
      if (dataBookDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataBookDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataBookDetail.thumbnail
          }`,
        };
      }

      if (dataBookDetail.slider) {
        dataBookDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }

      setFileList([imgThumbnail, ...imgSlider]);
    }
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const onClose = () => {
    setOpen(false);
    // setDataBookDetail(null);
  };

  return (
    <>
      <div className="book__detail__drawer">
        <Drawer
          title="Thông tin chi tiết sách"
          placement="right"
          width="50vw"
          onClose={onClose}
          open={open}
        >
          <div className="book__detail__drawer__description">
            <Descriptions title="Thông tin sách" bordered column={2}>
              <Descriptions.Item label="Id">
                {dataBookDetail._id}
              </Descriptions.Item>
              <Descriptions.Item label="Tên sách">
                {dataBookDetail.mainText}
              </Descriptions.Item>
              <Descriptions.Item label="Tác giả">
                {dataBookDetail.author}
              </Descriptions.Item>
              <Descriptions.Item label="Giá tiền">
                <NumericFormat
                  value={dataBookDetail.price}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={" đ"}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {dataBookDetail.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Đã bán">
                {dataBookDetail.sold}
              </Descriptions.Item>
              <Descriptions.Item label="Thể loại" span={2}>
                {dataBookDetail.category}
              </Descriptions.Item>
              <Descriptions.Item label="Create At">
                {moment(dataBookDetail.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Update At">
                {moment(dataBookDetail.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="book__detail__drawer__upload">
            <Divider orientation="left"> Ảnh của sách</Divider>
            <Upload
              //   action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              //   onChange={handleChange}
              showUploadList={{ showRemoveIcon: false }}
            />
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </div>
        </Drawer>
      </div>
    </>
  );
}
