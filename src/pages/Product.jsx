import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  Pagination,
  Input,
} from "antd";

import AddProductModal from "../components/modal/AddProductModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsThunk } from "../redux/slice/productSlice";
import EditProductModal from "../components/modal/EditProductModal";

// table code start
const columns = [
  {
    title: "Product name",
    dataIndex: "name",
    key: "name",
    width: "32%",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image) => <img src={image} width={40} />,
  },

  {
    title: "Color",
    key: "color",
    dataIndex: "color",
  },
  {
    title: "Rating",
    key: "rating",
    dataIndex: "rating",
  },

  {
    title: "Price",
    render: ({ price }) => <div>{price?.price}</div>,
  },
  {
    title: "Percent",
    render: ({ price }) => (
      <div>{price?.percent ? price?.percent : "no sale"}</div>
    ),
  },
];

function Product() {
  const dispatch = useDispatch();
  const [id, setID] = useState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { productList } = useSelector((state) => state.product);
  console.log(productList);
  const [pagination, setPagination] = useState({
    page: 1,
    page_limit: 6,
    total_pages: 0,
    total: 0,
  });

  console.log(pagination);
  const [keyword, setKeyword] = useState("");

  const [sort, setSort] = useState("asc");
  const onChange = (e) => setSort(e.target.value);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleOpenEditModal = () => {
    setIsOpenEdit(true);
  };

  const fetchProduct = async (page) => {
    try {
      dispatch(
        getAllProductsThunk({
          page: page,
          pageSize: pagination.page_limit,
          sort: sort,
          search: keyword,
        })
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (keyword.length > 0) {
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }));
    }
    fetchProduct(pagination.page);
  }, [pagination.page, sort, keyword]);

  useEffect(() => {
    if (productList?.metadata) {
      setPagination((prev) => ({
        ...prev,
        total_pages: productList.metadata.total_pages,
        total: productList.metadata.total,
      }));
    }
  }, [productList]);

  const onPageChange = (page) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: page,
    }));
  };

  console.log(id);

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <div className="w-full h-full">
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Product"
              extra={
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="search"
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <div className="flex gap-5">
                    <Radio.Group onChange={onChange} defaultValue="a">
                      <Radio.Button value="asc">Ascending</Radio.Button>
                      <Radio.Button value="desc">Descending</Radio.Button>
                    </Radio.Group>
                    <Button
                      className="bg-blue-600 text-white"
                      onClick={handleOpenModal}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              }
            >
              <div className="w-full">
                <Table
                  columns={columns}
                  dataSource={productList?.data}
                  pagination={false}
                  onRow={(record) => ({
                    onClick: () => {
                      setID(record.id);
                      handleOpenEditModal();
                    },
                  })}
                  className="h-[500px]"
                ></Table>
                <Pagination
                  className="justify-self-center"
                  current={pagination.page}
                  pageSize={pagination.page_limit}
                  total={pagination.total}
                  onChange={onPageChange}
                  showTotal={(total) => `Total ${total} items`}
                />
              </div>
            </Card>
          </div>
        </Row>
      </div>
      <AddProductModal isOpen={isOpen} onClose={setIsOpen} />
      {id && (
        <EditProductModal
          isOpen={isOpenEdit}
          onClose={setIsOpenEdit}
          productID={id}
        />
      )}
    </>
  );
}

export default Product;
