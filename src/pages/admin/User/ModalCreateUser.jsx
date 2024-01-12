import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Divider,
  notification,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { postCreateNewUser } from "../../../utils/api";
import { WarningTwoTone } from "@ant-design/icons";

const ModalCreateUser = (props) => {
  const { isModalOpen, setIsModalOpen, fetchListUsers } = props;
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
    },
  };

  const onFinish = async (values) => {
    const { fullName, password, email, phone } = values;
    console.log("check values", values);
    let res = await postCreateNewUser(fullName, password, email, phone)
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
    console.log(res);
    if (res.data) {
      message.success("Create user Success!");
      form.resetFields();
      await fetchListUsers();
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        cancelText="Hủy"
        okText="Tạo mới"
      >
        <Divider />
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          validateMessages={validateMessages}
          form={form}
        >
          <Form.Item
            name="fullName"
            label="Tên hiển thị"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCreateUser;
