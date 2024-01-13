import {
  Button,
  Col,
  InputNumber,
  Form,
  Row,
  Input,
  Radio,
  Divider,
  Checkbox,
  message,
} from "antd";
import chinhHang from "../../assets/chinh-hang.png";

import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { doDeleteItem, doResetCart } from "../../redux/order/orderSlice";
import { postCreateOrder } from "../../utils/api";

export default function Payment(props) {
  const { totalPrice, setCurrent } = props;
  const [form] = Form.useForm();
  const user = useSelector((state) => state?.account?.user);
  const itemCart = useSelector((state) => state?.order?.cart);
  const dispatch = useDispatch();

  useEffect(() => {}, [itemCart]);

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user]);

  const handleDeleteItem = (id) => {
    dispatch(doDeleteItem(id));
  };

  const onFinish = async (values) => {
    const listBooks = [];
    itemCart.map((item) => {
      listBooks.push({
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item.id,
      });
    });
    const data = {
      name: values.fullName,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: listBooks,
    };

    let res = await postCreateOrder(data);
    if (res.statusCode === 400) {
      message.error(res.message);
    } else {
      message.success(res.data);
      dispatch(doResetCart());
    }
    setCurrent(2);
  };

  return (
    <div className="order">
      <Row gutter={20}>
        <Col lg={16} xs={24}>
          <div className="order__content">
            {itemCart &&
              itemCart.length > 0 &&
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
                            <p>
                              Tác giả:
                              {item?.detail?.author}
                            </p>
                            <p>
                              Thể loại:
                              {item?.detail?.category}
                            </p>
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
                        Số lượng: <></>
                        {item?.quantity}
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
              })}
          </div>
        </Col>
        <Col lg={8} xs={24}>
          <div className="order__payment-info">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              //   onValuesChange={onRequiredTypeChange}
            >
              <Form.Item
                label="Tên người nhận"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa điền tên người nhận",
                  },
                ]}
              >
                <Input placeholder="input placeholder" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa điền số điện thoại",
                  },
                ]}
              >
                <Input placeholder="input placeholder" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa điền địa chỉ",
                  },
                ]}
              >
                <Input.TextArea placeholder="input placeholder" />
              </Form.Item>
            </Form>
            <div style={{ margin: "5px 0 10px" }}>Hình thức thanh toán</div>
            <Checkbox>Thanh toán khi nhận hàng</Checkbox>
            <Divider />
            <div>
              Tổng tiền:<> </>
              <NumericFormat
                value={totalPrice}
                displayType={"text"}
                thousandSeparator={true}
                suffix=" ₫"
              />
            </div>
            <Divider />
            <Button
              disabled={itemCart.length === 0}
              block
              type="primary"
              danger
              onClick={() => form.submit()}
            >
              Đặt hàng ({itemCart?.length})
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
