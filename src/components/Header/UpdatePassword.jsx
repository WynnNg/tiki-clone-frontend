import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { postChangePassword } from "../../utils/api";

export default function UpdatePassword() {
  const user = useSelector((state) => state.account.user);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user]);

  const onFinish = async (values) => {
    let res = await postChangePassword(values);
    if (res.data) {
      message.success("Cập nhập mật khẩu thành công!");
      form.resetFields(["oldpass", "newpass"]);
    } else {
      message.error(res.message);
    }
    console.log("check password ", res);
  };

  return (
    <div style={{ width: "50%" }}>
      <Form
        form={form}
        name="profile"
        style={{
          maxWidth: 600,
        }}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item label="Email" name="email">
          <Input placeholder="email" disabled />
        </Form.Item>

        <Form.Item
          label="Mật khẩu hiện tại"
          name="oldpass"
          rules={[
            {
              required: true,
              message: "Vui lòng cập nhập tên của bạn!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newpass"
          rules={[
            {
              required: true,
              message: "Vui lòng cập nhập số điện thoại!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Cập nhập</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
