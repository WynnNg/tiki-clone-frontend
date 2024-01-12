import React, { useState } from "react";
import {
  Button,
  Input,
  Space,
  Badge,
  Drawer,
  Dropdown,
  message,
  Avatar,
  Popover,
} from "antd";
import tikiLogo from "../../assets/tiki_logo.png";
import "./Header.scss";
import {
  DownOutlined,
  HomeFilled,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postLogout } from "../../utils/api";
import { doLogout } from "../../redux/account/accountSlice";
import { NumericFormat } from "react-number-format";
import ModalUpdateProfile from "./ModalUpdateProfile";

export default function Header(props) {
  const { searchTerm, setSearchTerm } = props;
  const { Search } = Input;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const urlAvatar =
    import.meta.env.VITE_BACKEND_URL + `/images/avatar/${user.avatar}`;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.order.cart);

  const handleLogout = async () => {
    let res = await postLogout();
    if (res?.data) {
      dispatch(doLogout());
      message.success(res.data);
      navigate("/");
    }
    console.log(res);
  };

  let items = [
    {
      key: "account",
      label: (
        <span onClick={() => setOpenProfile(true)}>Quản lý tài khoản</span>
      ),
    },
    {
      key: "logout",
      label: <span onClick={handleLogout}>Đăng xuất</span>,
    },
  ];

  if (user.role === "ADMIN") {
    items.unshift({
      key: "admin",
      label: <Link to="/admin">Trang quản trị</Link>,
    });
  }

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const renderContentCart = () => {
    return (
      <div className="popover-cart__content">
        {cart?.length > 0 ? (
          cart.map((item) => {
            const imgThumbnail = `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${item?.detail?.thumbnail}`;
            return (
              <div className="popover-cart__content__item" key={item.id}>
                <div className="popover-cart__content__item__img">
                  <img src={imgThumbnail} />
                </div>
                <div className="popover-cart__content__item__title">
                  {item?.detail?.mainText} -
                </div>
                <div className="popover-cart__content__item__price">
                  <NumericFormat
                    value={item?.detail?.price}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix=" đ"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <>Không có sản phẩm nào trong giỏ hàng</>
        )}

        <div className="popover-cart__content__button">
          <Link to="/order">
            <Button type="primary">Xem Giỏ Hàng</Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header__brand">
          <Link to="/">
            <img src={tikiLogo} alt="logo" />
          </Link>
        </div>
        <div className="header__search">
          <Space.Compact style={{ width: "100%", height: "100%" }}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your book"
              prefix={<SearchOutlined style={{ color: "#ccc" }} />}
            />
            <Button style={{ color: "rgb(10, 104, 255)", height: "100%" }}>
              Tìm kiếm
            </Button>
          </Space.Compact>
        </div>
        <div className="header__menu">
          <div className="header__menu__home">
            <Link to="/">
              <HomeFilled
                style={{ fontSize: "24px", color: "rgb(10, 104, 255)" }}
              />
              <span>Trang chủ</span>
            </Link>
          </div>
          <div className="header__menu__profile">
            {isAuthenticated ? (
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottomLeft"
              >
                <Link>
                  <Avatar src={urlAvatar} />
                  <span>{user.fullName}</span>
                </Link>
              </Dropdown>
            ) : (
              <Link to="/login">
                <SmileOutlined
                  style={{ fontSize: "24px", color: "rgb(10, 104, 255)" }}
                />
                <span>Tài khoản</span>
              </Link>
            )}
          </div>
          <div className="header__menu__drawer">
            <MenuOutlined onClick={toggleDrawer} />
            <Drawer
              title="Menu"
              placement="left"
              onClose={toggleDrawer}
              open={openDrawer}
              key="left"
            >
              <div className="header__menu__drawer__home">
                <Link to="/">
                  <HomeFilled
                    style={{ fontSize: "24px", color: "rgb(10, 104, 255)" }}
                  />
                  <span>Trang chủ</span>
                </Link>
              </div>
              <div className="header__menu__drawer__profile">
                {isAuthenticated ? (
                  <Dropdown
                    menu={{
                      items,
                    }}
                    placement="bottomLeft"
                    trigger={["click"]}
                  >
                    <Link>
                      <SmileOutlined
                        style={{ fontSize: "24px", color: "rgb(10, 104, 255)" }}
                      />
                      <span>Tài khoản</span>
                      <DownOutlined />
                    </Link>
                  </Dropdown>
                ) : (
                  <Link to="/login">
                    <SmileOutlined
                      style={{ fontSize: "24px", color: "rgb(10, 104, 255)" }}
                    />
                    <span>Tài khoản</span>
                  </Link>
                )}
              </div>
            </Drawer>
          </div>
          <div className="header__menu__cart">
            <Link>
              <Popover
                placement="leftTop"
                title="Sản phẩm mới được thêm vào"
                content={renderContentCart}
                rootClassName="popover-cart"
              >
                <Badge count={cart?.length}>
                  <ShoppingCartOutlined
                    style={{ fontSize: "24px", color: "rgb(10, 104, 255)" }}
                  />
                </Badge>
              </Popover>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <ModalUpdateProfile
          isModalOpen={openProfile}
          setIsModalOpen={setOpenProfile}
        />
      </div>
    </div>
  );
}
