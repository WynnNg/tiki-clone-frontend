import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Rate,
  Row,
  Space,
  Tabs,
  notification,
  Pagination,
  InputNumber,
  Spin,
  Drawer,
} from "antd";
import React, { useEffect, useState } from "react";
import { FilterTwoTone, RedoOutlined, WarningTwoTone } from "@ant-design/icons";
import ndtk from "../../assets/nhanduyentienkiep.webp";
import { useOutletContext } from "react-router-dom";
import "./Home.scss";
import { getBookCategory, getBooksWithPaginate } from "../../utils/api";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

export default function Home() {
  const [category, setCategory] = useState([]);
  const [current, setCurrent] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [listBooks, setListBooks] = useState([]);
  const [sortQuery, setSortQuery] = useState("&sort=-sold");
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useOutletContext();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchListBooks();
  }, [current, pageSize, sortQuery, filter, searchTerm]);

  const fetchListBooks = async () => {
    let query = "";
    if (sortQuery) {
      query += sortQuery;
    }
    if (filter) {
      query += filter;
    }
    if (searchTerm) {
      query += `&mainText=/${searchTerm}/i
      `;
    }
    setIsLoading(true);
    let res = await getBooksWithPaginate(current, pageSize, query)
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
    setIsLoading(false);
    if (res && res.data) {
      setListBooks(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const fetchCategory = async () => {
    let res = await getBookCategory()
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
      setCategory(res.data);
    }
  };

  const onPaginateChange = (current, pageSize) => {
    setCurrent(current);
    setPageSize(pageSize);
  };

  const onChangeCheckBox = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  const onChangeTab = (key) => {
    setSortQuery(`&sort=${key}`);
  };

  const handleFormOnChange = (changedValues, allValues) => {
    if (changedValues.category) {
      const cate = allValues.category;
      if (cate && cate.length > 0) {
        const cateString = cate.join(",");
        setFilter(`&category=${cateString}`);
      } else {
        setFilter("");
      }
    }
  };

  const onFinishForm = (values) => {
    console.log("check values form ", values);
    if (values.minPrice >= 0 && values.maxPrice >= 0) {
      let query = `&price>=${values.minPrice}&price<=${values.maxPrice}`;
      if (values?.category?.length > 0) {
        const cate = values.category.join(",");
        query += `&category=${cate}`;
      }
      setFilter(query);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setFilter("");
    setSearchTerm("");
  };

  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  };

  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };

  const itemsTab = [
    {
      key: "-sold",
      label: "Phổ biến",
      children: "",
    },
    {
      key: "-updatedAt",
      label: "Hàng mới",
      children: "",
    },
    {
      key: "price",
      label: "Giá thấp đến cao",
      children: "",
    },
    {
      key: "-price",
      label: "Giá cao đến thấp",
      children: "",
    },
  ];

  const cardTitle = (item) => {
    return (
      <>
        <div style={{ fontWeight: "400", fontSize: "14px" }}>
          {item.mainText}
        </div>
        <div style={{ display: "flex", alignItems: "end", gap: "10px" }}>
          <div>
            <Rate
              defaultValue={5}
              disabled
              style={{
                fontSize: "10px",
              }}
            />
          </div>
          <div
            style={{ fontWeight: "400", fontSize: "10px", color: "#808089" }}
          >
            Đã bán {item.sold}
          </div>
        </div>
      </>
    );
  };

  const cardDescription = (item) => {
    return (
      <>
        <div style={{ color: "black", display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>
            <NumericFormat
              value={item.price}
              displayType={"text"}
              thousandSeparator={true}
            />

            <sup style={{ top: "-0.5rem" }}>đ</sup>
          </div>
          <div
            style={{
              display: "inline-block",
              height: "18px",
              marginLeft: "4px",
              padding: "0px 4px",
              background: "rgb(245, 245, 250)",
              borderRadius: "1000px",
              color: "rgb(39, 39, 42)",
              fontSize: "12px",
              fontWeight: 500,
              lineHeight: "150%",
            }}
          >
            -35%
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="home">
      <div className="container">
        <Row gutter={10}>
          <Col xl={4} lg={5} xs={0} sm={0}>
            <div className="home__sidebar">
              <Form
                onValuesChange={handleFormOnChange}
                onFinish={onFinishForm}
                form={form}
              >
                <div className="home__sidebar__header">
                  <Row justify="space-between" align="middle">
                    <Col>
                      <div>
                        <Space size="small">
                          <FilterTwoTone />
                          <span className="home__sidebar__header__title">
                            Bộ lọc tìm kiếm
                          </span>
                        </Space>
                      </div>
                    </Col>
                    <Col>
                      <Button type="ghost" onClick={() => resetForm()}>
                        <RedoOutlined />
                      </Button>
                    </Col>
                  </Row>
                </div>

                <div className="home__sidebar__category">
                  <div className="home__sidebar__category__title">
                    Danh mục sản phẩm
                  </div>
                  <div className="home__sidebar__category__item">
                    <Form.Item name="category">
                      <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={onChangeCheckBox}
                      >
                        <Row gutter={[5, 5]}>
                          {category &&
                            category.map((item, index) => (
                              <Col span={24} key={index}>
                                <Checkbox value={item}>{item}</Checkbox>
                              </Col>
                            ))}
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                  </div>
                </div>
                <Divider />

                <div className="home__sidebar__price">
                  <div className="home__sidebar__price__title">Khoảng giá</div>

                  <Row gutter={5} justify="space-between">
                    <Col span={11}>
                      <Form.Item name="minPrice">
                        <InputNumber
                          placeholder="đ TỪ"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item name="maxPrice">
                        <InputNumber
                          placeholder="đ ĐẾN"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      Áp dụng
                    </Button>
                  </Form.Item>
                </div>
              </Form>
              <Divider />
              <div className="home__sidebar__rating">
                <div className="home__sidebar__rating__title">Đánh giá</div>
                <Rate allowHalf defaultValue={5} style={{ fontSize: "16px" }} />
                <Space>
                  <Rate
                    allowHalf
                    defaultValue={4}
                    style={{ fontSize: "16px" }}
                  />
                  <span>Trở lên</span>
                </Space>
                <Space>
                  <Rate
                    allowHalf
                    defaultValue={3}
                    style={{ fontSize: "16px" }}
                  />
                  <span>Trở lên</span>
                </Space>
                <Space>
                  <Rate
                    allowHalf
                    defaultValue={2}
                    style={{ fontSize: "16px" }}
                  />
                  <span>Trở lên</span>
                </Space>
                <Space>
                  <Rate
                    allowHalf
                    defaultValue={1}
                    style={{ fontSize: "16px" }}
                  />
                  <span>Trở lên</span>
                </Space>
              </div>
            </div>
          </Col>
          <Col xl={20} lg={19} md={24}>
            <div className="home__main">
              <div className="home__main__tabs">
                <Tabs
                  defaultActiveKey="1"
                  items={itemsTab}
                  onChange={onChangeTab}
                />
              </div>
              <div className="home__main__filter">
                <span onClick={showDrawer}>
                  <FilterTwoTone />
                  <> </>
                  Bộ lọc
                </span>
                <Drawer
                  title="Lọc Sản Phẩm"
                  placement="right"
                  // width="576px"
                  onClose={onClose}
                  open={open}
                >
                  <div className="home__sidebar">
                    <Form
                      onValuesChange={handleFormOnChange}
                      onFinish={onFinishForm}
                      form={form}
                    >
                      <div className="home__sidebar__category">
                        <div className="home__sidebar__category__title">
                          Danh mục sản phẩm
                        </div>
                        <div className="home__sidebar__category__item">
                          <Form.Item name="category">
                            <Checkbox.Group
                              style={{ width: "100%" }}
                              onChange={onChangeCheckBox}
                            >
                              <Row gutter={[5, 5]}>
                                {category &&
                                  category.map((item, index) => (
                                    <Col span={24} key={index}>
                                      <Checkbox value={item}>{item}</Checkbox>
                                    </Col>
                                  ))}
                              </Row>
                            </Checkbox.Group>
                          </Form.Item>
                        </div>
                      </div>
                      <Divider />

                      <div className="home__sidebar__price">
                        <div className="home__sidebar__price__title">
                          Khoảng giá
                        </div>

                        <Row gutter={5} justify="space-between">
                          <Col span={11}>
                            <Form.Item name="minPrice">
                              <InputNumber
                                placeholder="đ TỪ"
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={11}>
                            <Form.Item name="maxPrice">
                              <InputNumber
                                placeholder="đ ĐẾN"
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: "100%" }}
                          >
                            Áp dụng
                          </Button>
                        </Form.Item>
                      </div>
                    </Form>
                    <Divider />
                    <div className="home__sidebar__rating">
                      <div className="home__sidebar__rating__title">
                        Đánh giá
                      </div>
                      <Rate
                        allowHalf
                        defaultValue={5}
                        style={{ fontSize: "16px" }}
                      />
                      <Space>
                        <Rate
                          allowHalf
                          defaultValue={4}
                          style={{ fontSize: "16px" }}
                        />
                        <span>Trở lên</span>
                      </Space>
                      <Space>
                        <Rate
                          allowHalf
                          defaultValue={3}
                          style={{ fontSize: "16px" }}
                        />
                        <span>Trở lên</span>
                      </Space>
                      <Space>
                        <Rate
                          allowHalf
                          defaultValue={2}
                          style={{ fontSize: "16px" }}
                        />
                        <span>Trở lên</span>
                      </Space>
                      <Space>
                        <Rate
                          allowHalf
                          defaultValue={1}
                          style={{ fontSize: "16px" }}
                        />
                        <span>Trở lên</span>
                      </Space>
                    </div>
                  </div>
                </Drawer>
              </div>
              <div className="home__main__content">
                {isLoading ? (
                  <div
                    style={{
                      margin: 250,
                    }}
                  >
                    <Spin size="large" />
                  </div>
                ) : (
                  <>
                    <div className="home__main__content__card">
                      {listBooks &&
                        listBooks.map((item) => {
                          let bookThumbnail = `${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${item.thumbnail}`;
                          return (
                            <div
                              key={item._id}
                              className="home__main__content__card__info"
                              onClick={() => handleRedirectBook(item)}
                            >
                              <div className="home__main__content__card__info__img">
                                <img alt="example" src={bookThumbnail} />
                              </div>
                              <div className="home__main__content__card__info__title">
                                <div
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    margin: "5px 0",
                                  }}
                                >
                                  {item.mainText}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "end",
                                    gap: "10px",
                                    margin: "10px 0",
                                  }}
                                >
                                  <div>
                                    <Rate
                                      defaultValue={5}
                                      disabled
                                      style={{
                                        fontSize: "10px",
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "10px",
                                      color: "#808089",
                                    }}
                                  >
                                    Đã bán {item.sold}
                                  </div>
                                </div>
                              </div>
                              <div className="home__main__content__card__info__desc">
                                <div
                                  style={{
                                    color: "black",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <NumericFormat
                                      value={item.price}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />

                                    <sup style={{ top: "-0.5rem" }}>đ</sup>
                                  </div>
                                  <div
                                    style={{
                                      display: "inline-block",
                                      height: "18px",
                                      marginLeft: "4px",
                                      padding: "0px 4px",
                                      background: "rgb(245, 245, 250)",
                                      borderRadius: "1000px",
                                      color: "rgb(39, 39, 42)",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      lineHeight: "150%",
                                    }}
                                  >
                                    -35%
                                  </div>
                                </div>
                              </div>
                              {/* <Card
                                hoverable
                                cover={
                                  <img alt="example" src={bookThumbnail} />
                                }
                                onClick={() => handleRedirectBook(item)}
                              >
                                <Meta
                                  title={cardTitle(item)}
                                  description={cardDescription(item)}
                                />
                              </Card> */}
                            </div>
                          );
                        })}
                    </div>
                    <Row justify="center">
                      <Pagination
                        current={current}
                        total={total}
                        showSizeChanger
                        pageSizeOptions={[5, 10, 20, 50, 100]}
                        // onShowSizeChange={onShowSizeChange}
                        onChange={onPaginateChange}
                      />
                    </Row>
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
