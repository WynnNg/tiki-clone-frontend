import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  BookOutlined,
  DollarOutlined,
  DownOutlined,
  HomeFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Dropdown, Avatar, message } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
const { Sider, Content, Footer } = Layout;
import "./AdminPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { postLogout } from "../../utils/api";
import { doLogout } from "../../redux/account/accountSlice";

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const urlAvatar =
    import.meta.env.VITE_BACKEND_URL + `/images/avatar/${user.avatar}`;

  useEffect(() => {
    if (location.pathname === "/admin") {
      setSelectedKey("dashboard");
    }
    if (location.pathname === "/admin/user") {
      setSelectedKey("CRUD");
    }
    if (location.pathname === "/admin/book") {
      setSelectedKey("manageBooks");
    }
    if (location.pathname === "/admin/order") {
      setSelectedKey("manageOrders");
    }
  }, [location.pathname]);
  const handleLogout = async () => {
    let res = await postLogout();
    if (res.data) {
      dispatch(doLogout());
      message.success(res.data);
      navigate("/");
    }
  };

  const itemsAccount = [
    {
      key: "account",
      label: <Link to="/">Quản lý tài khoản</Link>,
    },
    {
      key: "logout",
      label: <Link onClick={handleLogout}>Đăng xuất</Link>,
    },
  ];

  return (
    <div className="admin">
      <Layout>
        <div className="admin__sider">
          <Sider
            trigger={null}
            collapsible
            breakpoint="lg"
            onBreakpoint={(broken) => {
              if (broken) {
                setCollapsed(true);
              } else {
                setCollapsed(false);
              }
            }}
            collapsed={collapsed}
            style={{
              overflow: "auto",
              height: "100%",
            }}
          >
            <div
              style={{
                color: "white",
                textAlign: "center",
                margin: "30px 0",
                fontSize: "18px",
                fontWeight: "400",
              }}
            >
              <h3>Admin</h3>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedKey}
              items={[
                {
                  key: "dashboard",
                  icon: <AppstoreOutlined />,
                  label: <Link to="/admin"> Dashboard</Link>,
                },
                {
                  key: "manageUsers",
                  icon: <UserOutlined />,
                  label: "Manage Users",
                  children: [
                    {
                      key: "CRUD",
                      icon: <TeamOutlined />,
                      label: <Link to="/admin/user">CRUD</Link>,
                    },
                    {
                      key: "files1",
                      icon: <TeamOutlined />,
                      label: "files1",
                    },
                  ],
                },
                {
                  key: "manageBooks",
                  icon: <BookOutlined />,
                  label: <Link to="/admin/book">Manage Books</Link>,
                },
                {
                  key: "manageOrders",
                  icon: <DollarOutlined />,
                  label: <Link to="/admin/order">Manage Orders</Link>,
                },
              ]}
            />
          </Sider>
        </div>
        <Layout className="admin__layout">
          <div className="admin__main">
            <div className="admin__main__header">
              <div className="admin__main__header__toggle">
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                  }}
                />
              </div>
              <div className="admin__main__header__menu">
                <div className="admin__main__header__menu__home">
                  <Link to="/">
                    <HomeFilled
                      style={{ fontSize: "24px", color: "rgb(10, 104, 255)" }}
                    />
                    <span>Trang chủ</span>
                  </Link>
                </div>
                <div className="admin__main__header__menu__profile">
                  <Dropdown
                    menu={{
                      items: itemsAccount,
                    }}
                    placement="bottomLeft"
                  >
                    <Link>
                      <Avatar src={urlAvatar} />
                      <span>{user.fullName}</span>
                    </Link>
                  </Dropdown>
                </div>
              </div>
            </div>

            <Content className="admin__main__content">
              <Outlet />
            </Content>
            <Footer
              style={{
                textAlign: "center",
                // height: 6,
              }}
            >
              Ant Design ©2023 Created by Ant UED
            </Footer>
          </div>
        </Layout>
      </Layout>
    </div>
  );
};
export default AdminPage;
