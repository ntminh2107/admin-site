import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  List,
  Descriptions,
  Avatar,
  Tag,
  Pagination,
} from "antd";

import { PlusOutlined, ExclamationOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllOrderThunk } from "../redux/slice/orderSlice";
import { DetailOrderModal } from "../components/modal/DetailOrder";
import AddProductModal from "../components/modal/AddProductModal";

function formatTransactionDate(dateInput) {
  // Check if the dateInput is valid
  const date = new Date(dateInput);
  if (isNaN(date)) {
    throw new Error("Invalid date");
  }

  // Get the day, month, year, hours, and minutes
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits for day
  const month = date.toLocaleString("en-US", { month: "long" }); // Full month name
  const year = date.getFullYear(); // Full year

  // Format the date string
  return `${day}, ${month} ${year}`;
}

function Billing() {
  const { orderList } = useSelector((state) => state.order);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [orderDetail, setOrderDetail] = useState({});

  const [pagination, setPagination] = useState({
    page: 1,
    page_limit: 4,
    total_pages: 0,
    total: 0,
  });

  const orders = orderList.data?.filter(
    (order) => order?.status === "complete"
  );

  const handleOpenModal = (order) => {
    setIsOpenModal(true);
    setOrderDetail(order);
  };

  const fetchOrders = async (page) => {
    try {
      dispatch(
        getAllOrderThunk({
          page: page,
          pageSize: pagination.page_limit,
        })
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const onPageChange = (page) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: page,
    }));
  };

  useEffect(() => {
    fetchOrders(pagination.page);
  }, [pagination.page]);

  useEffect(() => {
    if (orderList?.meta) {
      setPagination((prevPagination) => ({
        ...prevPagination,
        total: orderList.meta.total,
        total_pages: orderList.meta.total_pages,
      }));
    }
  }, [orderList]);
  return (
    <>
      <Row gutter={[24, 0]} className="h-full">
        <Col span={24} md={16} className=" box-border flex flex-col h-full">
          <Card
            className="bg-white h-full shadow-none flex flex-col"
            title={[<h6 className="font-semibold m-0">Billing Information</h6>]}
          >
            <div className="flex flex-col gap-3 justify-between h-full">
              <div className="flex flex-col gap-5 h-full">
                {orderList.data?.map((order, index) => (
                  <Card
                    className="card-billing-info"
                    bordered="false"
                    key={order.id}
                  >
                    <div className="flex ">
                      <Descriptions title={`order No: ${order.id}`}>
                        <Descriptions.Item label="Name of Receiver" span={3}>
                          {order.address.fullname}
                        </Descriptions.Item>

                        <Descriptions.Item label="User email Address" span={3}>
                          {order.user.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total order" span={3}>
                          {`${order.total} $`}
                        </Descriptions.Item>
                        <Descriptions.Item label="status" span={3}>
                          {order.status === "pending" && (
                            <Tag color="processing">PENDING</Tag>
                          )}
                          {order.status === "complete" && (
                            <Tag color="success">COMPLETE</Tag>
                          )}
                          {order.status === "decline" && (
                            <Tag color="error">DECLINE</Tag>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                      <Button
                        onClick={() => handleOpenModal(order)}
                        className="bg-blue-600 text-white tracking-wide rounded-2xl self-end"
                      >
                        Detail
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Pagination
                className="justify-self-center"
                current={pagination.page}
                pageSize={pagination.page_limit}
                total={pagination.total}
                onChange={onPageChange}
                showSizeChanger
                pageSizeOptions={["3", "5", "10"]}
                showTotal={(total) => `Total ${total} items`}
              />
            </div>
          </Card>
        </Col>
        <Col span={24} md={8} className="mb-24">
          <Card
            bordered={false}
            className="header-solid mb-4 ant-invoice-card"
            title={[<h6 className="font-semibold m-0">Invoices</h6>]}
          >
            <List
              itemLayout="horizontal"
              className="invoice-list"
              dataSource={orders}
              renderItem={(order) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      href={order.transaction?.receiptURL}
                      target="_blank"
                    >
                      Receipt PDF
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={`At ${formatTransactionDate(
                      order.transaction?.createdAt
                    )}`}
                    description={`#${order.transaction?.id.slice(0, 8)}`}
                  />
                  <div className="amount">{`${order.transaction?.amount} $`}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <DetailOrderModal
        openModal={isOpenModal}
        handleOpenModal={setIsOpenModal}
        orderDetail={orderDetail}
      />
    </>
  );
}

export default Billing;
