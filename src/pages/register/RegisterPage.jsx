import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Layout,
  notification,
  message,
} from "antd";

import "./RegisterPage.scss";
import { postRegister } from "../../utils/api";
import { CheckCircleTwoTone, WarningTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Content } = Layout;

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);

    let res = await postRegister(fullName, email, password, phone)
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

    console.log("check res:", res);

    if (res.data && res.data._id) {
      message.success("Create Account Success!");
      navigate("/login");
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h4 className="register-title">CREATE ACCOUNT</h4>
        <Form
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 1200,
            minWidth: 400,
          }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please input your full name!",
              },
            ]}
          >
            <Input placeholder="Your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input placeholder="Your email" />
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
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone!",
              },
            ]}
          >
            <Input style={{ width: "100%" }} placeholder="Your phone" />
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <p style={{ fontSize: "14px", textAlign: "center" }}>
          Have already an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;
