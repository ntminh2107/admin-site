/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

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
  const data = [
    {
      title: "March, 01, 2021",
      description: "#MS-415646",
      amount: "$180",
    },
    {
      title: "February, 12, 2021",
      description: "#RV-126749",
      amount: "$250",
    },
    {
      title: "April, 05, 2020",
      description: "#FB-212562",
      amount: "$550",
    },
    {
      title: "June, 25, 2019",
      description: "#QW-103578",
      amount: "$400",
    },
    {
      title: "March, 03, 2019",
      description: "#AR-803481",
      amount: "$700",
    },
  ];

  const download = [
    <svg
      width="15"
      height="15"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key="0"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 17C3 16.4477 3.44772 16 4 16H16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17ZM6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289L9 10.5858L9 3C9 2.44772 9.44771 2 10 2C10.5523 2 11 2.44771 11 3L11 10.5858L12.2929 9.29289C12.6834 8.90237 13.3166 8.90237 13.7071 9.29289C14.0976 9.68342 14.0976 10.3166 13.7071 10.7071L10.7071 13.7071C10.5196 13.8946 10.2652 14 10 14C9.73478 14 9.48043 13.8946 9.29289 13.7071L6.29289 10.7071C5.90237 10.3166 5.90237 9.68342 6.29289 9.29289Z"
        fill="#111827"
      ></path>
    </svg>,
  ];

  const mins = [
    <svg
      width="10"
      height="10"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 10C5 9.44772 5.44772 9 6 9L14 9C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11L6 11C5.44772 11 5 10.5523 5 10Z"
        className="fill-danger"
      ></path>
    </svg>,
  ];
  const newest = [
    {
      headding: <h6>NEWEST</h6>,
      avatar: mins,
      title: "Netflix",
      description: "27 March 2021, at 12:30 PM",
      amount: "- $2,500",
      textclass: "text-light-danger",
      amountcolor: "text-danger",
    },
    {
      avatar: <PlusOutlined style={{ fontSize: 10 }} />,
      title: "Apple",
      description: "27 March 2021, at 04:30 AM",
      amount: "+ $2,000",
      textclass: "text-fill",
      amountcolor: "text-success",
    },
  ];

  const { orderList } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    page: 1,
    page_limit: 3,
    total_pages: 0,
    total: 0,
  });

  const orders = orderList.data?.filter(
    (order) => order?.status === "complete"
  );

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
      <Row gutter={[24, 0]}></Row>
      <Row gutter={[24, 0]}>
        <Col
          span={24}
          md={16}
          className="mb-24 box-border flex flex-col h-full"
        >
          <Card
            className="bg-white h-full shadow-none flex flex-col"
            title={[<h6 className="font-semibold m-0">Billing Information</h6>]}
          >
            <div className="flex flex-col gap-3 justify-between h-full">
              <div className="flex flex-col gap-3 ">
                {orderList.data?.map((order, index) => (
                  <Card
                    className="card-billing-info"
                    bordered="false"
                    key={order.id}
                  >
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

          <Card
            bordered={false}
            bodyStyle={{ paddingTop: 0 }}
            className="header-solid ant-list-yes"
            title={<h6 className="font-semibold m-0">Customer Transactions</h6>}
          >
            <List
              className="transactions-list ant-newest"
              itemLayout="horizontal"
              dataSource={newest}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar size="small" className={item.textclass}>
                        {item.avatar}
                      </Avatar>
                    }
                    title={item.title}
                    description={item.description}
                  />
                  <div className="amount">
                    <span className={item.amountcolor}>{item.amount}</span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Billing;
