import React, { useEffect, useState } from "react";
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
import {
  getAccount,
  postCreateNewUser,
  putUpdateUser,
} from "../../../utils/api";
import { WarningTwoTone } from "@ant-design/icons";
import { doFetchAccount } from "../../../redux/account/accountSlice";
import { useDispatch } from "react-redux";

const ModalEditUser = (props) => {
  const { isModalOpen, setIsModalOpen, fetchListUsers, dataUser } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (dataUser && isModalOpen) {
      form.setFieldsValue(dataUser);
    }
  }, [dataUser]);

  const onFinish = async (values) => {
    const { fullName, phone } = values;

    let res = await putUpdateUser(dataUser._id, fullName, phone)
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
    if (res.data) {
      message.success("Cập nhập user thành công");
      await fetchListUsers();
    }

    setIsModalOpen(false);
    console.log("check update", res);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        cancelText="Hủy"
        okText="Cập nhập"
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
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input disabled={true} />
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

export default ModalEditUser;
