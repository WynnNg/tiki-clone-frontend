import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Table,
  Space,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  message,
} from "antd";
import {
  deleteUser,
  getAccount,
  getUsersWithPaginate,
} from "../../../utils/api";
import ViewUser from "./ViewUserDetail";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  DeliveredProcedureOutlined,
  EditTwoTone,
  PlusOutlined,
  RedoOutlined,
  WarningTwoTone,
} from "@ant-design/icons";
import ModalCreateUser from "./ModalCreateUser";
import ModalUploadUser from "./ModalUploadUser";
import * as XLSX from "xlsx";
import ModalEditUser from "./ModalEditUser";

import moment from "moment";

import "./User.scss";

export default function User() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [listUsers, setListUsers] = useState([]);
  const [total, setTotal] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [openViewUser, setOpenViewUser] = useState(false);
  const [dataDetailUser, setDataDetailUser] = useState({});
  const [dataEditUser, setDataEditUser] = useState({});
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [showModalUploadUser, setShowModalUploadUser] = useState(false);
  const [showModalEditUser, setShowModalEditUser] = useState(false);

  useEffect(() => {
    fetchListUsers();
  }, [current, pageSize]);

  const fetchListUsers = async () => {
    let query = "";

    let res = await getUsersWithPaginate(current, pageSize, query);
    if (res.data) {
      setListUsers(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const handleViewUser = (record) => {
    console.log(record);
    setOpenViewUser(true);
    setDataDetailUser(record);
  };

  const handleEditUser = (record) => {
    setShowModalEditUser(true);
    setDataEditUser(record);
  };

  const handleDeleteUser = async (record) => {
    let res = await deleteUser(record._id)
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
    if (res.data) {
      message.success("Xóa người dùng thành công");
      await fetchListUsers();
    }
    console.log(res);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return <a onClick={() => handleViewUser(record)}>{record._id}</a>;
      },
    },
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: {},
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: {},
      responsive: ["md"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: {},
      responsive: ["sm"],
    },
    {
      title: "Ngày cập nhập",
      dataIndex: "updatedAt",
      sorter: {},
      responsive: ["md"],
      render: (text, record, index) => {
        return moment(record.updatedAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Action",
      dataIndex: "phone",
      render: (_, record) => (
        <Space>
          <Popconfirm
            placement="left"
            trigger="click"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteUser(record)}
            description={
              <div>
                <p>Bạn có muốn xóa người dùng này? </p>
              </div>
            }
            title={
              <div>
                <p>Xác nhận xóa người dùng</p>
              </div>
            }
          >
            <Button type="dashed" danger>
              <DeleteTwoTone twoToneColor="red" />
            </Button>
          </Popconfirm>
          <Button type="dashed" danger onClick={() => handleEditUser(record)}>
            <EditTwoTone twoToneColor="red" />
          </Button>
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }

    if (sorter) {
      if (sorter.order === "ascend") {
        let query = `&sort=${sorter.field}`;
        sortListUsers(query);
      }
      if (sorter.order === "descend") {
        let query = `&sort=-${sorter.field}`;
        sortListUsers(query);
      }
    }
    // console.log("params", pagination, filters, sorter, extra);
  };

  const sortListUsers = async (query) => {
    if (query) {
      let res = await getUsersWithPaginate(current, pageSize, query);
      if (res.data) {
        setListUsers(res.data.result);
        setTotal(res.data.meta.total);
      }
    }
  };

  const clearSearchInput = () => {
    setName("");
    setEmail("");
    setPhone("");
    fetchListUsers();
  };

  const searchListUsers = async () => {
    let query = "";
    if (name) {
      query += `&fullName=/${name}/i`;
    }
    if (email) {
      query += `&email=/${email}/i`;
    }
    if (phone) {
      query += `&phone=/${phone}/i`;
    }
    if (query) {
      let res = await getUsersWithPaginate(current, pageSize, query);
      if (res.data) {
        setListUsers(res.data.result);
        setTotal(res.data.meta.total);
      }
    }
  };

  const downloadExcel = () => {
    if (listUsers.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUsers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workbook, "DataSheet.xlsx");
    }
  };

  const renderHeaderTable = () => {
    return (
      <div
        className="header"
        // style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span>Table List Users</span>
        <div className="header__button">
          <div className="header__button__file">
            <Button
              type="primary"
              icon={<DeliveredProcedureOutlined />}
              onClick={downloadExcel}
            >
              Export
            </Button>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => setShowModalUploadUser(true)}
            >
              Import
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowModalCreateUser(true)}
            >
              Thêm mới
            </Button>
          </div>
          <span>
            <Button type="ghost" onClick={fetchListUsers}>
              <RedoOutlined />
            </Button>
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="user">
        <div className="user__input">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col md={8} xs={24}>
                <Form.Item label="Name">
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col md={8} xs={24}>
                <Form.Item label="Email">
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col md={8} xs={24}>
                <Form.Item label="Phone number">
                  <Input
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Form.Item>
                <Space>
                  <Button type="primary" onClick={searchListUsers}>
                    Search
                  </Button>
                  <Button onClick={clearSearchInput}>Clear</Button>
                </Space>
              </Form.Item>
            </Row>
          </Form>
        </div>
        <div className="user__table">
          <Table
            title={() => renderHeaderTable()}
            columns={columns}
            dataSource={listUsers}
            onChange={onChange}
            rowKey={(record) => record._id}
            scroll={{ y: 320 }}
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              pageSizeOptions: [1, 2, 5, 10, 20, 50, 100],
              showTotal: (total, range) => (
                <div>
                  {range[0]}-{range[1]} trên {total} hàng
                </div>
              ),
            }}
          />
        </div>
        <div>
          <ViewUser
            open={openViewUser}
            setOpen={setOpenViewUser}
            dataDetailUser={dataDetailUser}
          />
        </div>
        <div>
          <ModalCreateUser
            isModalOpen={showModalCreateUser}
            setIsModalOpen={setShowModalCreateUser}
            fetchListUsers={fetchListUsers}
          />
        </div>
        <div>
          <ModalUploadUser
            isModalOpen={showModalUploadUser}
            setIsModalOpen={setShowModalUploadUser}
            fetchListUsers={fetchListUsers}
          />
        </div>
        <div>
          <ModalEditUser
            isModalOpen={showModalEditUser}
            setIsModalOpen={setShowModalEditUser}
            fetchListUsers={fetchListUsers}
            dataUser={dataEditUser}
          />
        </div>
      </div>
    </>
  );
}
