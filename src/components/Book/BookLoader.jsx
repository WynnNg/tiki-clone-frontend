import { Col, Row, Skeleton } from "antd";
import React from "react";

export default function BookLoader() {
  return (
    <div className="container">
      <Row gutter={[20, 20]} style={{ margin: "20px 0" }}>
        <Col span={7}>
          <Skeleton.Input active style={{ width: "368px", height: "368px" }} />
          <div
            style={{
              margin: "10px 0",
              display: "flex",
              justifyContent: "space-between",
              width: "368px",
            }}
          >
            <Skeleton.Image active />
            <Skeleton.Image active />
            <Skeleton.Image active />
          </div>
        </Col>
        <Col span={12}>
          <Skeleton active />
          <br />
          <br />
          <Skeleton active />
          <br />
          <br />
          <Skeleton active />
          <br />
          <br />
          <Skeleton active />
          <br />
          <br />
          <br />
          <br />
        </Col>
        <Col span={5}>
          <Skeleton active />
          <br />
          <div style={{ margin: "10px 0" }}>
            <Skeleton.Button block />
          </div>
          <div style={{ width: "100%" }}>
            <Skeleton.Button block />
          </div>
        </Col>
      </Row>
    </div>
  );
}
