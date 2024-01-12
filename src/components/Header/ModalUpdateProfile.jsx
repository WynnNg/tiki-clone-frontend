import React from "react";
import { Button, Modal, Tabs } from "antd";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";

export default function ModalUpdateProfile(props) {
  const { isModalOpen, setIsModalOpen } = props;
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (key) => {
    // console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Cập nhập thông tin",
      children: <UpdateProfile />,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <UpdatePassword />,
    },
  ];

  return (
    <div>
      <Modal
        title="Quản lý tài khoản"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width="50%"
      >
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
    </div>
  );
}
