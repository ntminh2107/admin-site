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

import { ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import ava1 from "../assets/images/logo-shopify.svg";
import ava2 from "../assets/images/logo-atlassian.svg";
import ava3 from "../assets/images/logo-slack.svg";
import ava5 from "../assets/images/logo-jira.svg";
import ava6 from "../assets/images/logo-invision.svg";
import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";
import face6 from "../assets/images/face-6.jpeg";
import pencil from "../assets/images/pencil.svg";
import AddProductModal from "../components/modal/AddProductModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsThunk } from "../redux/slice/productSlice";
import Column from "antd/lib/table/Column";
import Search from "antd/lib/input/Search";

const { Title } = Typography;

const formProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
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
    fetchProduct(pagination.page);
  }, [pagination.page, sort]);

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
                <>
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
                </>
              }
            >
              <div className="w-full">
                <Table
                  columns={columns}
                  dataSource={productList?.data}
                  pagination={false}
                  className="h-[500px]"
                >
                  <Column title="Action"></Column>
                </Table>
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
    </>
  );
}

export default Product;
