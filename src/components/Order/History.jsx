import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import { getHistory } from "../../utils/api";
import moment from "moment";
import ReactJson from "react-json-view";
import { NumericFormat } from "react-number-format";
import { v4 as uuidv4 } from "uuid";

import "./History.scss";

export default function History() {
  const [dataHistory, setDataHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    let res = await getHistory();
    if (res.data) {
      const data = [];
      res.data.map((item, index) => {
        data.push({
          id: item._id,
          index: index + 1,
          createdAt: moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss"),
          totalPrice: (
            <NumericFormat
              value={item.totalPrice}
              displayType={"text"}
              thousandSeparator={true}
              suffix=" ₫"
            />
          ),
          detail: item.detail,
        });
      });
      setDataHistory(data);
    }

    console.log("check history ", res);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Tổng số tiền tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Trạng thái",
      key: "tags",
      dataIndex: "tags",
      render: (_, record) => (
        <div key={record.id}>
          <Tag color="green">Thành công</Tag>
        </div>
      ),
    },
    {
      title: "Chi tiết",
      key: "detail",
      dataIndex: "detail",
      render: (_, record) => (
        <div key={record.id}>
          <ReactJson src={record.detail} name="Chi tiết đơn mua" />
        </div>
      ),
    },
  ];

  return (
    <div className="history">
      <div className="container">
        <div className="history__title">Lịch sử đặt hàng</div>
        <div className="history__table">
          <Table
            columns={columns}
            dataSource={dataHistory}
            rowKey={(record) => {
              record.id;
            }}
          />
        </div>
      </div>
    </div>
  );
}
