import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  message,
  Upload,
  Modal,
  Divider,
  notification,
  Space,
  Table,
  Row,
} from "antd";
import * as XLSX from "xlsx";
import { postCreateListUsers } from "../../../utils/api";
import templateFile from "./sample.xlsx?url";

const { Dragger } = Upload;

const columns = [
  {
    title: "Tên hiển thị",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
];

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 1000);
};

const ModalUploadUser = (props) => {
  const [dataExcel, setDataExcel] = useState([]);

  const { isModalOpen, setIsModalOpen, fetchListUsers } = props;

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,

    //   action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    accept:
      ".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    customRequest: dummyRequest,
    onChange(info) {
      console.log(info);
      const { status } = info.file;
      if (status !== "uploading") {
        //   console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          let reader = new FileReader();

          reader.readAsArrayBuffer(file);

          reader.onload = function (e) {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: "array" });
            // find the name of your sheet in the workbook first
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];

            // convert to json format
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: ["fullName", "email", "phone"],
              range: 1,
            });
            if (jsonData && jsonData.length > 0) {
              console.log(jsonData);
              setDataExcel(jsonData);
            }
          };
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const handleOk = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });

    let res = await postCreateListUsers(data)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        notification.error({
          message: error.response.data.message,
          description: `statusCode: ${error.statusCode}`,
        });
      });

    if (res.data) {
      notification.success({
        message: "Upload Success",
        description: `Record Success: ${res.data.countSuccess} - Record Error: ${res.data.countError}`,
      });
    }

    setIsModalOpen(false);
    setDataExcel([]);
    fetchListUsers();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setDataExcel([]);
  };

  return (
    <Modal
      title="Import Data User"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="Cancel"
      okText="Import Data"
      size="large"
      width="50vw"
      okButtonProps={{ disabled: dataExcel.length < 1 }}
    >
      <Divider />

      <Dragger {...propsUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files. Or{" "}
          <a onClick={(e) => e.stopPropagation()} href={templateFile} download>
            Dowload Sample File
          </a>
        </p>
      </Dragger>

      <div className="upload__table">
        <h4 style={{ padding: "10px", margin: "15px 0" }}>Dữ liệu upload:</h4>
        <Table
          columns={columns}
          dataSource={dataExcel}
          rowKey={(record) => record.email}
        />
      </div>
    </Modal>
  );
};
export default ModalUploadUser;
