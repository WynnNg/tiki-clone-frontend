import React, { useEffect, useState } from "react";
import {
  Avatar,
  Col,
  Row,
  Space,
  Button,
  message,
  Upload,
  Form,
  Input,
  notification,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { postUploadAvatar, putUpdateProfile } from "../../utils/api";
import { doUpdateProfile } from "../../redux/account/accountSlice";

export default function UpdateProfile() {
  const [avatarImg, setAvatarImg] = useState("");
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      setAvatarImg(user.avatar);
      form.setFieldsValue(user);
    }
  }, [user]);

  const handleFileUploadAvatar = async ({ file, onSuccess, onError }) => {
    let res = await postUploadAvatar(file)
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
      setAvatarImg(res.data.fileUploaded);
      dispatch(doUpdateProfile({ avatar: res.data.fileUploaded }));
      onSuccess("Ok");
    } else {
      onError("Opp! Something went wrong");
    }
  };

  const onFinishForm = async (values) => {
    const { fullName, phone } = values;
    const data = {
      fullName,
      phone,
      avatar: avatarImg,
      _id: user.id,
    };
    let res = await putUpdateProfile(data);

    if (res.data) {
      message.success("Cập nhập thông tin tài khoản thành công!");
      dispatch(doUpdateProfile({ avatar: avatarImg, fullName: fullName }));
    }
  };

  const props = {
    name: "file",
    maxCount: 1,
    customRequest: handleFileUploadAvatar,
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="modal-update-profile__info">
      <Row gutter={[10, 20]}>
        <Col md={12} xs={24}>
          <Row gutter={[10, 20]}>
            <Col span={24}>
              <Avatar
                size={150}
                icon={<UserOutlined />}
                src={
                  avatarImg
                    ? import.meta.env.VITE_BACKEND_URL +
                      `/images/avatar/${avatarImg}`
                    : null
                }
              />
            </Col>
            <Col span={24}>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Col>
          </Row>
        </Col>
        <Col md={12} xs={24}>
          <Form
            name="profile"
            form={form}
            onFinish={onFinishForm}
            style={{
              maxWidth: 600,
            }}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item label="Email" name="email">
              <Input placeholder="email" disabled />
            </Form.Item>

            <Form.Item
              label="Tên hiển thị"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng cập nhập tên của bạn!",
                },
              ]}
            >
              <Input placeholder="fullName" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Vui lòng cập nhập số điện thoại!",
                },
              ]}
            >
              <Input placeholder="0888570485" />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Cập nhập</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
