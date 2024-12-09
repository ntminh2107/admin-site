import { Modal, Descriptions, Tag, Button } from "antd";

export const DetailOrderModal = ({
  handleOpenModal,
  openModal,
  orderDetail,
}) => {
  const formatTransactionDate = (dateInput) => {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}, ${month} ${year} at ${hours}:${minutes}`;
  };
  return (
    <Modal
      open={openModal}
      footer={false}
      onCancel={() => handleOpenModal(false)}
      title={`Order No: ${orderDetail.id}`}
      className="m-auto"
      width={800}
      centered
    >
      <div className="p-4 w-full">
        {/* User Information & Shipping Address (Same Row) */}
        <section className="mb-6 flex flex-row gap-6">
          {/* User Information */}
          <div className="w-full">
            <h3 className="font-semibold text-xl mb-2">User Information</h3>
            <Descriptions bordered column={1} className="w-full">
              <Descriptions.Item label="Full Name">
                {orderDetail.user?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {orderDetail.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {orderDetail.user?.phoneNumber}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Shipping Address */}
          <div className="w-full">
            <h3 className="font-semibold text-xl mb-2">Shipping Address</h3>
            <Descriptions bordered column={1} className="w-full">
              <Descriptions.Item label="Full Name">
                {orderDetail.address?.fullname}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {orderDetail.address?.address}, {orderDetail.address?.district},{" "}
                {orderDetail.address?.city}, {orderDetail.address?.country}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {orderDetail.address?.phoneNumber}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </section>

        {/* Order Status & Shipping Method */}
        <section className="mb-6">
          <h3 className="font-semibold text-xl mb-2">
            Order Status & Shipping
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-lg">Status</h4>
              <Tag
                color={orderDetail.status === "complete" ? "green" : "orange"}
              >
                {orderDetail.status?.toUpperCase()}
              </Tag>
            </div>
            <div>
              <h4 className="font-semibold text-lg">Shipping Method</h4>
              <p>
                {orderDetail.shipMethod?.method} (
                {orderDetail.shipMethod?.detail})
              </p>
              <p className="text-gray-500">{`$${orderDetail.shipMethod?.price.toFixed(
                2
              )}`}</p>
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="mb-6">
          <h3 className="font-semibold text-xl mb-2">Order Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderDetail.orderItems?.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-contain mb-4 rounded-md"
                />
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
                <p className="font-semibold text-lg text-gray-800">{`$${(
                  item.price * item.quantity
                )?.toFixed(2)}`}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction Details */}
        {orderDetail.transaction && (
          <section className="mb-6">
            <h3 className="font-semibold text-xl mb-2">Transaction Details</h3>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Transaction ID">
                {orderDetail.transaction.id.slice(0, 8)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Intent ID">
                {orderDetail.transaction.stripePaymentIntentID}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag
                  color={
                    orderDetail.transaction.stripeStatus === "succeeded"
                      ? "green"
                      : "red"
                  }
                >
                  {orderDetail.transaction.stripeStatus.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Amount Paid">{`$${orderDetail.transaction.amount.toFixed(
                2
              )}`}</Descriptions.Item>
              <Descriptions.Item label="Currency">
                {orderDetail.transaction.currency}
              </Descriptions.Item>
              <Descriptions.Item label="Receipt URL">
                <Button
                  type="link"
                  href={orderDetail.transaction.receiptURL}
                  target="_blank"
                >
                  View Receipt
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="Transaction Date">
                {formatTransactionDate(orderDetail.transaction.createdAt)}
              </Descriptions.Item>
            </Descriptions>
          </section>
        )}

        {/* Total Amount */}
        <section className="mt-4 text-right">
          <h3 className="font-semibold text-xl">
            Total: ${orderDetail.total?.toFixed(2)}
          </h3>
        </section>
      </div>
    </Modal>
  );
};
