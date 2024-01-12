import {
  DeleteTwoTone,
  DeliveredProcedureOutlined,
  EditTwoTone,
  PlusOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
  notification,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "./Book.scss";
import { deleteBook, getBooksWithPaginate } from "../../../utils/api";
import ViewBookDetail from "./ViewBookDetail";
import ModalAddBook from "./ModalAddBook";
import ModalUpdateBook from "./ModalUpdateBook";
import * as XLSX from "xlsx";

export default function Book() {
  const [listBooks, setListBooks] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState();
  const [filterQuery, setFilterQuery] = useState();
  const [sortQuery, setSortQuery] = useState("&sort=-updatedAt");
  const [openBookDetail, setOpenBookDetail] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataBookDetail, setDataBookDetail] = useState({});
  const [dataBookUpdate, setDataBookUpdate] = useState({});

  const [form] = Form.useForm();

  useEffect(() => {}, [dataBookUpdate]);

  useEffect(() => {
    fetchListBooks();
  }, [pageSize, current, filterQuery, sortQuery]);

  const fetchListBooks = async () => {
    let query = "";
    if (filterQuery) {
      query += filterQuery;
      setCurrent(1);
    }
    if (sortQuery) {
      query += sortQuery;
    }
    let res = await getBooksWithPaginate(current, pageSize, query);
    if (res.data) {
      setListBooks(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const onFinishForm = (values) => {
    let query = "";
    if (values.mainText) {
      query += `&mainText=/${values.mainText}/i`;
    }
    if (values.author) {
      query += `&author=/${values.author}/i`;
    }
    if (values.category) {
      query += `&category=/${values.category}/i`;
    }
    setFilterQuery(query);
  };

  const onClearForm = () => {
    form.resetFields();
    setFilterQuery("");
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    // console.log("check param ", pagination, filters, sorter);
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
    let query = "";
    if (sorter.order === "ascend") {
      query += `&sort=${sorter.field}`;
    }
    if (sorter.order === "descend") {
      query += `&sort=-${sorter.field}`;
    }
    setSortQuery(query);
  };

  const downloadExcel = () => {
    if (listBooks.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listBooks);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workbook, "DataSheet.xlsx");
    }
  };

  const renderTableHeader = () => {
    return (
      <div className="book__table__header">
        <div className="book__table__header__title">Table List books</div>
        <div className="book__table__header__button">
          <Space>
            <Button
              type="primary"
              icon={<DeliveredProcedureOutlined />}
              onClick={downloadExcel}
            >
              Export
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalAddOpen(true)}
            >
              Thêm mới
            </Button>
            <Button type="ghost">
              <RedoOutlined />
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  const onClickBookDetail = (record) => {
    setOpenBookDetail(true);
    setDataBookDetail(record);
    console.log("check data book detail ", record);
  };

  const handleEditBook = (record) => {
    setDataBookUpdate(record);
    setIsModalUpdateOpen(true);
  };

  const handleDeleteBook = async (record) => {
    let res = await deleteBook(record._id)
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
      message.success("Xóa sách thành công");
      await fetchListBooks();
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      render: (text, record) => (
        <a onClick={() => onClickBookDetail(record)}>{text}</a>
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      key: "mainText",
      sorter: {},
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "category",
      sorter: {},
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      sorter: {},
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      sorter: {},
    },
    {
      title: "Ngày cập nhập",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text, record, index) => {
        return moment(record.updatedAt).format("DD/MM/YYYY HH:mm:ss");
      },
      sorter: {},
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            placement="left"
            trigger="click"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteBook(record)}
            description={
              <div>
                <p>Bạn có muốn xóa quyển sách này? </p>
              </div>
            }
            title={
              <div>
                <p>Xác nhận xóa sách</p>
              </div>
            }
          >
            <Button type="dashed" danger>
              <DeleteTwoTone twoToneColor="red" />
            </Button>
          </Popconfirm>
          <Button type="dashed" danger onClick={() => handleEditBook(record)}>
            <EditTwoTone twoToneColor="red" />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        className="book"
        style={{ display: "flex", flexDirection: "column", gap: "30px" }}
      >
        <div className="book__search">
          <Form layout="vertical" onFinish={onFinishForm} form={form}>
            <Row gutter={15}>
              <Col span={8}>
                <Form.Item name="mainText" label="Tên sách">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="author" label="Tác giả">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="category" label="Thể loại">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Space>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button onClick={onClearForm}>Clear</Button>
                </Form.Item>
              </Space>
            </Row>
          </Form>
        </div>
        <div className="book__table">
          <Table
            title={() => renderTableHeader()}
            columns={columns}
            onChange={handleTableChange}
            dataSource={listBooks}
            rowKey={(record) => record._id}
            scroll={{
              y: 280,
            }}
            pagination={{
              current: current,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              pageSizeOptions: [2, 5, 10, 20, 50, 100],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </div>
        <div className="book__detail">
          <ViewBookDetail
            open={openBookDetail}
            setOpen={setOpenBookDetail}
            dataBookDetail={dataBookDetail}
            setDataBookDetail={setDataBookDetail}
          />
        </div>
        <div>
          <ModalAddBook
            isModalOpen={isModalAddOpen}
            setIsModalOpen={setIsModalAddOpen}
            fetchListBooks={fetchListBooks}
          />
        </div>
        <div>
          <ModalUpdateBook
            isModalOpen={isModalUpdateOpen}
            setIsModalOpen={setIsModalUpdateOpen}
            fetchListBooks={fetchListBooks}
            dataBookUpdate={dataBookUpdate}
          />
        </div>
      </div>
    </>
  );
}
