import React, { useEffect, useState } from "react";
import "./Order.scss";
import { Button, Col, Divider, InputNumber, Row } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ndtk from "../../assets/nhanduyentienkiep.webp";
import chinhHang from "../../assets/chinh-hang.png";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { doDeleteItem, doUpdateCart } from "../../redux/order/orderSlice";
import { Link } from "react-router-dom";

export default function ViewCart(props) {
  const { setCurrent, totalPrice, setTotalPrice } = props;
  const dispatch = useDispatch();
  const itemCart = useSelector((state) => state?.order?.cart);

  useEffect(() => {}, [itemCart]);

  const handleOnChangeQuantity = (value, book) => {
    if (value <= 0) {
      return;
    }
    dispatch(
      doUpdateCart({
        id: book.id,
        quantity: value,
        bookQuantity: book?.detail?.quantity,
      })
    );
  };

  const handleDeleteItem = (id) => {
    dispatch(doDeleteItem(id));
  };

  return (
    <>
      <div className="order__title">
        <Row>
          <h2>GIỎ HÀNG</h2>
        </Row>
      </div>
      <Row gutter={20}>
        <Col span={18}>
          <div className="order__content">
            <div className="order__content__header">
              <Row gutter={10}>
                <Col span={10}>Sản phẩm</Col>
                <Col span={5} style={{ fontSize: "13px", color: "#787878" }}>
                  Đơn giá
                </Col>
                <Col span={3} style={{ fontSize: "13px", color: "#787878" }}>
                  Số lượng
                </Col>
                <Col span={3} style={{ fontSize: "13px", color: "#787878" }}>
                  Thành tiền
                </Col>
                <Col span={3} style={{ fontSize: "16px", color: "#787878" }}>
                  <DeleteOutlined />
                </Col>
              </Row>
            </div>
            {itemCart && itemCart.length > 0 ? (
              itemCart.map((item) => {
                return (
                  <div className="order__content__item" key={item?.id}>
                    <Row>
                      <Col span={10}>
                        <div className="order__content__item__product">
                          <div className="order__content__item__product__image">
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/images/book/${item?.detail?.thumbnail}`}
                              alt=""
                            />
                          </div>
                          <div className="order__content__item__product__info">
                            <div className="order__content__item__product__info__tag">
                              <img src={chinhHang} alt="" />
                            </div>
                            <h3>{item?.detail?.mainText}</h3>
                            <p>Tác giả: {item?.detail?.author}</p>
                            <p>Thể loại: {item?.detail?.category}</p>
                          </div>
                        </div>
                      </Col>
                      <Col
                        span={5}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <NumericFormat
                          value={item?.detail?.price}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix=" ₫"
                        />
                      </Col>
                      <Col
                        span={3}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <InputNumber
                          value={item?.quantity}
                          onChange={(value) =>
                            handleOnChangeQuantity(value, item)
                          }
                        />
                      </Col>
                      <Col
                        span={3}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <NumericFormat
                          value={item?.detail?.price * item?.quantity}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix=" ₫"
                        />
                      </Col>
                      <Col
                        span={3}
                        style={{
                          fontSize: "16px",
                          color: "#787878",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="ghost"
                          onClick={() => handleDeleteItem(item?.id)}
                        >
                          <DeleteOutlined />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  margin: "50px 0",
                }}
              >
                Giỏ hàng trống. <Link to="/">Quay lại trang mua hàng</Link>
              </div>
            )}
          </div>
        </Col>
        <Col span={6}>
          <div className="order__sidebar">
            <div className="order__sidebar__money">
              <div className="order__sidebar__money__price">
                <span>Tạm tính</span>{" "}
                <span>
                  <NumericFormat
                    value={totalPrice}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix=" ₫"
                  />
                </span>
              </div>
              <div className="order__sidebar__money__price">
                <span>Giảm giá</span> <span>0 đ</span>
              </div>
              <Divider />
              <div className="order__sidebar__money__price">
                <span>Tổng tiền</span>{" "}
                <span>
                  <NumericFormat
                    value={totalPrice}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix=" ₫"
                  />
                </span>
              </div>
            </div>
            <div className="order__sidebar__money__button">
              <Button
                block
                disabled={itemCart.length === 0}
                danger
                type="primary"
                size="large"
                onClick={() => setCurrent(1)}
              >
                Mua Hàng ({itemCart?.length})
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
