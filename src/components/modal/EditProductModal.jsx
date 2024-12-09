import React, { useEffect, useState } from "react";

import { Modal, Input, Button, Form, Upload, message } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductThunk,
  getProductDetailThunk,
} from "../../redux/slice/productSlice";

const s3 = new S3Client({
  region: "ap-southeast-2", // Asia Pacific (Hanoi) RegionID
  endpoint: "https://mos.ap-southeast-2.sufybkt.com", // Asia Pacific (Hanoi) Endpoint
  credentials: {
    accessKeyId: "JjAiNCBz4GMPLTAGu29vll4UHVR9STmLUQJWinvI",
    secretAccessKey: "nBbRiXDeo0R_pXkzeBOpTAxdyhJeCYyMpf6G7v9I",
  },
});

const EditProductModal = ({ isOpen, onClose, onSave, productID }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state.product);
  const [product, setProduct] = useState({
    name: productDetail.name,
    image: productDetail.image,
    color: productDetail.color,
    category: productDetail.category,
    brand: productDetail.brand,
    specifications: [...productDetail.specifications, { key: "", value: "" }],
    price: productDetail?.price.price,
    percent: productDetail?.price.percent,
    imagePreview: [...productDetail.imagePreview], // Default empty previews
  });

  // Handle image preview file select and update the preview URL
  const handlePreviewFileChange = (file, index) => {
    s3.send(
      new PutObjectCommand({
        Bucket: "tech-heim",
        Key: file.name,
        ContentType: file.type,
        Body: file,
      })
    ).then((data) => {
      if (data.$metadata.httpStatusCode === 200) {
        const newImagePreviews = [...product.imagePreview];
        newImagePreviews[
          index
        ] = `https://tech-heim.mos.ap-southeast-2.sufybkt.com/${file.name}`;
        setProduct({
          ...product,
          imagePreview: newImagePreviews,
        });
      }
    });

    return false; // Prevent Ant Design Upload component's default upload behavior
  };

  const handleSave = (values) => {
    const productData = {
      ...values,
      image: product.image,
      imagePreview: product.imagePreview,
      specifications: product.specifications,
    };
    console.log(productData);
    // dispatch(
    //   createProductThunk({
    //     name: productData.name,
    //     image: productData.image,
    //     price: productData.price,
    //     color: productData.color,
    //     category: productData.category,
    //     brand: productData.brand,
    //     specifications: productData.specifications,
    //     percent: productData.percent,
    //     imagePreview: productData.imagePreview,
    //   })
    // );
    console.log("product", product);
    onSave(productData);
    onClose();
  };

  const handleSpecificationChange = (index, key, value) => {
    const newSpecifications = [...product.specifications];
    newSpecifications[index][key] = value;
    setProduct({ ...product, specifications: newSpecifications });
  };

  const addSpecification = () => {
    setProduct({
      ...product,
      specifications: [...product.specifications, { key: "", value: "" }],
    });
  };

  const removeSpecification = (index) => {
    const newSpecifications = product.specifications.filter(
      (_, i) => i !== index
    );
    setProduct({ ...product, specifications: newSpecifications });
  };

  useEffect(() => {
    dispatch(getProductDetailThunk(productID));
  }, [productID, dispatch, isOpen]);

  return (
    <Modal
      title="Add Product"
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      width={800}
      className="p-4"
    >
      <Form form={form} onFinish={handleSave} layout="vertical">
        {/* Product Name */}
        <Form.Item
          label="Name"
          name="name"
          initialValue={product.name}
          rules={[
            { required: true, message: "Please enter the product name!" },
          ]}
        >
          <Input placeholder="Product Name" />
        </Form.Item>

        {/* Product Image Upload */}
        <Form.Item label="Main Image" name="image" initialValue={product.image}>
          <Upload
            name="image"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={async (file) => {
              // Start the upload to S3
              const fileName = file.name;

              try {
                // Upload the file to S3 using the PutObjectCommand
                await s3
                  .send(
                    new PutObjectCommand({
                      Bucket: "tech-heim",
                      Key: fileName,
                      ContentType: file.type,
                      Body: file,
                    })
                  )
                  .then((data) => {
                    if (data.$metadata.httpStatusCode === 200) {
                      const signedUrl = `https://tech-heim.mos.ap-southeast-2.sufybkt.com/${fileName}`;

                      // Update the product image URL in the state
                      setProduct((prevProduct) => ({
                        ...prevProduct,
                        image: signedUrl,
                      }));
                    }
                  });
              } catch (err) {
                console.error("Error uploading image: ", err);
              }

              // Prevent the default behavior of the Upload component
              return false;
            }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt="image"
                style={{ width: "100%", height: "auto" }}
              />
            ) : (
              <div>
                <PlusOutlined />
                <div>Upload Main Image</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Product Color */}
        <Form.Item label="Color" name="color" initialValue={product.color}>
          <Input placeholder="Product Color" />
        </Form.Item>

        {/* Product Category */}
        <Form.Item
          label="Category"
          name="category"
          initialValue={product.category}
        >
          <Input placeholder="Product Category" />
        </Form.Item>

        {/* Product Brand */}
        <Form.Item label="Brand" name="brand" initialValue={product.brand}>
          <Input placeholder="Product Brand" />
        </Form.Item>

        {/* Product Specifications */}
        <Form.Item
          label="Specifications"
          rules={[
            { required: true, message: "Please enter the specification" },
          ]}
        >
          {product.specifications.map((spec, index) => (
            <div className="flex items-center space-x-4 mb-4" key={index}>
              <div className="flex-1">
                <Input
                  value={spec.key}
                  onChange={(e) =>
                    handleSpecificationChange(index, "key", e.target.value)
                  }
                  placeholder="Key (e.g., Processor)"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecificationChange(index, "value", e.target.value)
                  }
                  placeholder="Value (e.g., Intel Core i9)"
                />
              </div>
              <Button
                type="text"
                icon={<MinusCircleOutlined />}
                onClick={() => removeSpecification(index)}
              />
            </div>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addSpecification}
            block
          >
            Add Specification
          </Button>
        </Form.Item>

        {/* Image Previews */}
        <Form.Item
          label="Image Previews"
          className="flex flex-wrap w-full justify-center"
        >
          <div className="flex justify-center">
            {product.imagePreview.map((preview, index) => (
              <div className="flex flex-col items-center mb-4 mr-4" key={index}>
                <div className="flex-1">
                  <Upload
                    name={`preview-${index}`}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={(file) =>
                      handlePreviewFileChange(file, index)
                    } // Handle file change for each preview
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt={`preview-${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div>Upload Preview Image {index + 1}</div>
                      </div>
                    )}
                  </Upload>
                </div>
                <Button
                  type="text"
                  icon={<MinusCircleOutlined />}
                  onClick={() => {
                    const newPreviews = [...product.imagePreview];
                    newPreviews[index] = ""; // Reset the preview at this index
                    setProduct({ ...product, imagePreview: newPreviews });
                  }}
                  className="mt-2"
                >
                  remove
                </Button>
              </div>
            ))}
          </div>
        </Form.Item>

        {/* Product Price */}
        <Form.Item
          label="Price"
          name="price"
          initialValue={product.price}
          rules={[
            { required: true, message: "Please enter the product price!" },
          ]}
        >
          <Input type="number" placeholder="Product Price" />
        </Form.Item>

        {/* Product Discount Percent */}
        <Form.Item
          label="Discount Percent"
          name="percent"
          initialValue={product.percent}
        >
          <Input type="number" placeholder="Discount Percentage" />
        </Form.Item>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Save Product
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
