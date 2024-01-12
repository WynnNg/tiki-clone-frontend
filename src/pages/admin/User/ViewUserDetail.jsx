import { Drawer, Descriptions } from "antd";
import moment from "moment";

const ViewUser = (props) => {
  const { open, setOpen, dataDetailUser } = props;

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Drawer
        title="Thông tin người dùng"
        placement="right"
        onClose={onClose}
        open={open}
        width="50vw"
      >
        <Descriptions bordered size="middle" column={2}>
          <Descriptions.Item label="Id">{dataDetailUser._id}</Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {dataDetailUser.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataDetailUser.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {dataDetailUser.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={2}>
            {dataDetailUser.role}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(dataDetailUser.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Update At">
            {moment(dataDetailUser.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default ViewUser;
