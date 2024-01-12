import React, { useEffect, useState } from "react";
import "./Order.scss";
import { Button, Col, Divider, InputNumber, Result, Row, Steps } from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import ndtk from "../../assets/nhanduyentienkiep.webp";
import chinhHang from "../../assets/chinh-hang.png";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { doDeleteItem, doUpdateCart } from "../../redux/order/orderSlice";
import { Link } from "react-router-dom";
import ViewCart from "./ViewCart";
import Payment from "./Payment";

export default function Order() {
  const [current, setCurrent] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const itemCart = useSelector((state) => state?.order?.cart);

  useEffect(() => {
    getTotalPrice();
  }, [itemCart]);

  const getTotalPrice = () => {
    let total = 0;
    itemCart.map((item) => {
      total += item?.quantity * item?.detail?.price;
    });
    setTotalPrice(total);
  };

  return (
    <div className="order">
      <div className="container">
        <div className="order__step">
          <div className="order__step__inner">
            <Steps
              current={current}
              items={[
                {
                  title: "Đơn hàng",
                },
                {
                  title: "Đặt hàng",
                },
                {
                  title: "Thanh toán",
                },
              ]}
            />
          </div>
          {current === 0 && (
            <ViewCart
              current={current}
              setCurrent={setCurrent}
              totalPrice={totalPrice}
              setTotalPrice={setTotalPrice}
            />
          )}
          {current === 1 && (
            <Payment
              current={current}
              setCurrent={setCurrent}
              totalPrice={totalPrice}
              setTotalPrice={setTotalPrice}
            />
          )}
          {current === 2 && (
            <Result
              icon={<SmileOutlined />}
              title="Đơn hàng đã đặt thành công!"
              extra={
                <Link to="/history">
                  <Button type="primary">Xem lịch sử</Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
