import {
  Col,
  Row,
  Rate,
  Descriptions,
  InputNumber,
  Button,
  notification,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./BookPage.scss";
import BookImage from "./BookImage";
import chinhHangTag from "../../assets/chinh-hang.png";
import { NumericFormat } from "react-number-format";
import { MinusOutlined, PlusOutlined, WarningTwoTone } from "@ant-design/icons";
import BookLoader from "./BookLoader";
import { getBookById } from "../../utils/api";
import { useDispatch } from "react-redux";
import { doAddToCart } from "../../redux/order/orderSlice";
import { Link } from "react-router-dom";

export default function BookPage() {
  const [quantityBook, setQuantityBook] = useState(1);
  const [bookData, setBookData] = useState();
  const dispatch = useDispatch();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id");

  useEffect(() => {
    fetchBookById();
  }, [id]);

  const fetchBookById = async () => {
    let res = await getBookById(id)
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
      setBookData(res.data);
    }
  };

  const onChangeQuantity = (value) => {
    setQuantityBook(value);
  };

  const handleAddToCart = () => {
    const cart = { id: bookData._id, quantity: quantityBook, detail: bookData };
    dispatch(doAddToCart(cart));
  };

  return (
    <div className="book-detail">
      <div className="container">
        <Row gutter={20}>
          <Col lg={7} xs={24}>
            <div className="book-detail__image">
              <BookImage bookData={bookData} />
            </div>
          </Col>
          <Col lg={12} xs={24}>
            <div className="book-detail__info">
              <div className="book-detail__info__author">
                <div className="book-detail__info__author__tag">
                  <img src={chinhHangTag} />
                </div>
                <span>Tác giả: {bookData?.author}</span>
              </div>
              <div className="book-detail__info__title">
                {bookData?.mainText}
              </div>
              <div className="book-detail__info__rate">
                <div className="book-detail__info__rate__count">5.0</div>
                <div className="book-detail__info__rate__star">
                  <Rate allowHalf defaultValue={5} disabled />
                  <span>
                    <> </>(1754)
                  </span>
                </div>

                <div className="book-detail__info__rate__sold">
                  Đã bán {bookData?.sold}
                </div>
              </div>
              <div className="book-detail__info__price">
                <NumericFormat
                  value={bookData?.price}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix=" đ"
                />
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
            <div className="book-detail__desc-short">
              <h3>Thông tin chi tiết</h3>
              <div>
                <Descriptions
                  column={1}
                  size="small"
                  bordered
                  labelStyle={{ backgroundColor: "white", fontWeight: "500" }}
                >
                  <Descriptions.Item label="Công ty phát hành">
                    Lorem ipsum
                  </Descriptions.Item>
                  <Descriptions.Item label="Kích thước">
                    14 x 20.5 cm
                  </Descriptions.Item>
                  <Descriptions.Item label="Tác giả">
                    {bookData?.author}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thể loại">
                    {bookData?.category}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng">
                    {bookData?.quantity}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhà xuất bản">
                    Lorem ipsum dolor sit amet
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
            <div className="book-detail__desc-long">
              <h3>Mô tả sản phẩm</h3>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
                labore explicabo ut reiciendis iste sunt iure, eaque magnam
                fugit ad neque itaque.
                <br />
                <br />
                Laborum consectetur ipsa hic obcaecati aut cupiditate
                laudantium? Totam a sint saepe accusamus earum similique dicta
                consectetur, cumque reprehenderit aliquam quo, itaque dolorum
                voluptatem nobis nam porro at neque ut consequatur maxime
                molestiae iure tenetur!
                <br />
                <br />
                Dolorem, deserunt sequi. Repudiandae veniam magni, cum, nulla
                eum autem atque dolorum eveniet possimus, soluta quam dolor!
                Consequuntur quia laboriosam rem nihil iure ullam quo explicabo
                eligendi magnam autem nulla, vero odit incidunt.
                <br />
                <br />
                Illum porro veniam necessitatibus consectetur sed tempore
                voluptates ducimus ad ipsa a veritatis sit aut eligendi impedit
                eius, doloribus sequi et voluptas saepe ab aperiam excepturi
                officia ea odio.
                <br />
                <br />
                Illo! Eius quibusdam voluptate neque nemo omnis modi, ea in iste
                quas quis aliquid officiis quaerat velit similique distinctio
                maiores illo repellendus commodi est? Alias, animi.
                <br />
                <br />
                Quibusdam accusamus culpa quam ipsa. Error sit, repudiandae esse
                illo officia est, quis ut alias dicta a eveniet laborum
                dignissimos eaque voluptates. Quibusdam magnam eum laborum
                officia, perspiciatis omnis facere ipsa quisquam eaque rem hic?
                <br />
                <br />
                Quis perspiciatis dolorum illum, rerum placeat exercitationem
                impedit earum maxime repudiandae ad, quos illo eos mollitia
                dolorem eligendi libero amet sit minus molestiae obcaecati.
                <br />
                <br />
                Quo atque eos eveniet esse quae. Vitae dolore incidunt officia
                in officiis architecto voluptatibus, reprehenderit voluptates
                eveniet est commodi exercitationem ducimus culpa consectetur,
                quos temporibus saepe vero? Consequatur earum similique placeat
                nemo laborum sed! Doloremque, nostrum.
                <br />
                <br />
                Ea, aliquam deserunt officiis voluptatibus recusandae sunt animi
                minima corrupti veniam, repellat dolore dolorum accusantium
                voluptate, error esse delectus.
                <br />
                <br />
                Quae ab, non nostrum debitis libero nihil voluptatum laudantium
                hic possimus. Facere laudantium officia animi quas dolores vero
                soluta eligendi aspernatur cumque facilis quasi reprehenderit
                beatae delectus cum corporis velit porro, officiis asperiores
                aut. Dolorem temporibus nesciunt dolores atque aperiam repellat?
              </p>
            </div>
          </Col>
          <Col lg={5} xs={24}>
            <div className="book-detail__cart">
              <div className="book-detail__cart__title">Số lượng</div>
              <div className="book-detail__cart__quantity">
                <Button
                  disabled={quantityBook === 1}
                  onClick={() =>
                    setQuantityBook((quantityBook) => quantityBook - 1)
                  }
                >
                  <MinusOutlined />
                </Button>
                <InputNumber
                  value={quantityBook}
                  onChange={onChangeQuantity}

                  //   style={{ width: "50px", textAlign: "center" }}
                />
                <Button
                  disabled={quantityBook === bookData?.quantity}
                  onClick={() =>
                    setQuantityBook((quantityBook) => quantityBook + 1)
                  }
                >
                  <PlusOutlined />
                </Button>
              </div>
              <div className="book-detail__cart__title">Tạm tính</div>
              <div className="book-detail__cart__price">
                <NumericFormat
                  value={bookData?.price * quantityBook}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix=" đ"
                />
              </div>
              <div className="book-detail__cart__button">
                <Link to="/order">
                  <Button
                    type="primary"
                    danger
                    block
                    style={{ margin: "20px 0 10px 0" }}
                    onClick={handleAddToCart}
                  >
                    Mua ngay
                  </Button>
                </Link>
                <Button
                  block
                  style={{ border: "0.8px solid #1677ff", color: "#1677ff" }}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    // <BookLoader />
  );
}
