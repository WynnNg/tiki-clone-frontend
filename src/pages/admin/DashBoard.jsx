import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, notification } from "antd";
import { getDashboard } from "../../utils/api";
import CountUp from "react-countup";

export default function DashBoard() {
  const [dataDashboard, setDataDashboard] = useState({});
  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    let res = await getDashboard()
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
      setDataDashboard(res.data);
    }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Tổng người dùng"
              value={dataDashboard.countUser}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Tổng đơn hàng"
              value={dataDashboard.countOrder}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
