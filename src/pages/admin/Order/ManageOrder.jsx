import React, { useEffect, useState } from "react";
import { Table, notification } from "antd";
import { getOrderWithPaginate } from "../../../utils/api";
import { WarningTwoTone } from "@ant-design/icons";
import { NumericFormat } from "react-number-format";
import moment from "moment";

export default function ManageOrder() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState();
  const [listOrder, setListOrder] = useState([]);
  const [sortQuery, setSortQuery] = useState("");

  useEffect(() => {
    fetchListOrders();
  }, [current, pageSize, sortQuery]);

  const fetchListOrders = async () => {
    let query = "";
    if (sortQuery) {
      query += sortQuery;
    }
    let res = await getOrderWithPaginate(current, pageSize, query)
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
      setTotal(res?.data?.meta?.total);
      setListOrder(res?.data?.result);
    }
  };

  const columns = [
    {
      title: "id",
      dataIndex: "_id",
      responsive: ["md"],
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      sorter: {},
      render: (_, record) => {
        return (
          <NumericFormat
            value={record.totalPrice}
            displayType={"text"}
            thousandSeparator={true}
            suffix=" đ"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: {},
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: {},
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: {},
    },
    {
      title: "Ngày cập nhập",
      responsive: ["md"],
      dataIndex: "updatedAt",
      sorter: {},
      render: (_, record) => {
        return moment(record.updatedAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination.current) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }
    if (sorter.order === "ascend") {
      setSortQuery(`&sort=${sorter.field}`);
    }

    if (sorter.order === "descend") {
      setSortQuery(`&sort=-${sorter.field}`);
    }
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={listOrder}
        onChange={onChange}
        rowKey={(record) => record._id}
        scroll={{
          y: 280,
          x: 300,
        }}
        pagination={{
          responsive: true,
          defaultPageSize: 2,
          showSizeChanger: true,
          pageSizeOptions: [2, 5, 10, 20, 50, 100],

          total: total,
          current: current,
        }}
      />
    </div>
  );
}
