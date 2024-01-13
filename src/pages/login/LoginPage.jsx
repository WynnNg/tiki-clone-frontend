import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Layout,
  notification,
  message,
  Row,
} from "antd";

import "./LoginPage.scss";
import { postLogin } from "../../utils/api";
import { WarningTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogin } from "../../redux/account/accountSlice";

const { Content } = Layout;

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);

    let res = await postLogin(username, password)
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

    setIsSubmit(false);

    console.log("check login ", res);

    if (res.data && res.data.access_token) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(doLogin(res.data.user));
      message.success("Login Success!");
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-form">
          <h4 className="login-title">WELCOME BACK</h4>
          <Form
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: "100%",
            }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input placeholder="Your username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Your password" />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                span: 24,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
              }}
              style={{ textAlign: "center" }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "35%", marginBottom: "10px" }}
                loading={isSubmit}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <p style={{ fontSize: "14px", textAlign: "center" }}>
            No account? <Link to="/register">Sign Up Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
