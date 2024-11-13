import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useForm } from "react-hook-form";
import { FaPlusSquare } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const UpdateProducts = () => {
  const [product] = useLoaderData();
  // States for cost and price calculation
  const [costRMB, setCostRMB] = useState(product?.costRMB);
  const [rmbRate, setRmbRate] = useState(product?.rmbRate);
  const [transportCost, setTransportCost] = useState(product?.transportCost);
  const [productCost, setProductCost] = useState(product?.productCost);
  const [productPrice, setProductPrice] = useState(product?.productPrice);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  // react form destructuring
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  // product destructuring
  const {
    _id: id,
    category,
    subCategory,
    subsubCategory,
    brand,
    productCode,
    inStock,
    stockAlert,
    date,
  } = product;

  // Calculate Product Cost and Price
  const calculateProductCost = (costRMB, rmbRate, transportCost) => {
    const costRMBNum = parseFloat(costRMB) || 0;
    const rmbRateNum = parseFloat(rmbRate) || 0;
    const transportCostNum = parseFloat(transportCost) || 0;

    const result = costRMBNum * rmbRateNum + transportCostNum;
    return parseFloat(result).toFixed(2); // Return as float rounded to two decimals
  };
  // Calculate Product Price as 10% markup over productCost
  const calculateProductPrice = (productCost) => {
    return (parseFloat(productCost) * 1.1).toFixed(2);
  };

  // Automatically update productCost and productPrice when any of the related values change
  useEffect(() => {
    const newProductCost = calculateProductCost(
      costRMB,
      rmbRate,
      transportCost
    );
    setProductCost(newProductCost);
    setProductPrice(calculateProductPrice(newProductCost));
  }, [costRMB, rmbRate, transportCost]);

  const onSubmit = async (data) => {
    console.log("Form submitted data: ", data);
    const product = {
      inStock: parseInt(data?.inStock, 10),
      productQuantity: parseInt(data?.productQuantity, 10),
      stockAlert: parseInt(data?.stockAlert, 10),
      costRMB: parseFloat(costRMB),
      rmbRate: parseFloat(rmbRate),
      transportCost: parseFloat(transportCost),
      productCost: parseFloat(productCost),
      productPrice: parseFloat(productPrice),
      date: data?.date,
    };
    console.log(product);
    try {
      const Response = await axiosPublic.patch(`/product/${id}`, product);
      console.log(Response.data.modifiedCount);
      if (Response.data.modifiedCount > 0) {
        // Show success popup
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "The product is updated successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        // Reset the form fields
        reset();
        navigate("/dashboard/manage-products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `Failed to update the product. Please try again.`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <>
      {/* Section Title */}
      <div>
        <SectionTitle
          subHeading="Update the required fields of the product"
          heading="UPDATING PRODUCT"
        />
      </div>
      {/* Update form  */}
      <div className="p-16">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First row -- Category */}
          <div className="flex gap-x-4 mb-4">
            {/* Product Category  */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Category</span>
              </div>
              <input
                type="text"
                className="textarea textarea-bordered"
                defaultValue={category}
                disabled
              />
            </div>
            {/* Product Sub-category Dropdown  */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Subcategory</span>
              </div>
              <input
                type="text"
                className="textarea textarea-bordered"
                defaultValue={subCategory}
                disabled
              />
            </div>
            {/* Product Sub-sub-category Dropdown  */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Subsubategory</span>
              </div>
              <input
                type="text"
                className="textarea textarea-bordered"
                defaultValue={subsubCategory}
                disabled
              />
            </div>
          </div>
          {/* Second Row  */}
          <div className="flex gap-x-4 mb-4">
            {/* Brands Dropdown  */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Brand</span>
              </div>
              <input
                type="text"
                className="textarea textarea-bordered"
                defaultValue={brand}
                disabled
              />
            </div>
            {/* ProductCode (SKU) */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Product Code</span>
              </div>
              <input
                type="text"
                className="textarea textarea-bordered"
                defaultValue={productCode}
                disabled
              />
            </div>
          </div>
          {/* Third Row  */}
          <div className="flex gap-x-4 mb-4">
            {/* In-Stock */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">In-Stock*</span>
              </div>
              <input
                type="number"
                defaultValue={inStock}
                readOnly
                className="textarea textarea-bordered bg-gray-100"
                {...register("inStock")}
              />
            </div>
            {/* Product Quantity */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Product Quantity*</span>
              </div>
              <input
                type="number"
                defaultValue={250}
                onFocus={(e) => e.target.select()}
                {...register("productQuantity", {
                  required: "Product Quantity is required",
                })}
                className="textarea textarea-bordered"
                placeholder="Product Quantity"
              />
              {errors.productQuantity && (
                <span className="text-red-500">
                  {errors.productQuantity.message}
                </span>
              )}
            </div>
            {/* Stock Alert */}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Stock Alert*</span>
              </div>
              <input
                type="number"
                defaultValue={50}
                onFocus={(e) => e.target.select()}
                {...register("stockAlert", {
                  required: "Stock Alert is required",
                })}
                className="textarea textarea-bordered"
                placeholder="Stock Alert"
              />
              {errors.stockAlert && (
                <span className="text-red-500">
                  {errors.stockAlert.message}
                </span>
              )}
            </div>
          </div>
          {/* Fourth Row  */}
          <div className="flex gap-x-4 mb-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Cost RMB*</span>
              </label>
              <input
                type="number"
                value={costRMB}
                {...register("costRMB", {
                  required: "Cost RMB is required",
                  min: {
                    value: 0.01,
                    message: "Cost RMB must be greater than 0",
                  },
                })}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setCostRMB(e.target.value)}
                className="textarea textarea-bordered"
                placeholder="Enter Cost RMB"
              />
              {errors.costRMB && (
                <span className="text-red-500">{errors.costRMB.message}</span>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">RMB Rate*</span>
              </label>
              <input
                type="number"
                value={rmbRate}
                {...register("rmbRate", {
                  required: "RMB Rate is required",
                  min: {
                    value: 0.01,
                    message: "RMB Rate must be greater than 0",
                  },
                })}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setRmbRate(e.target.value)}
                className="textarea textarea-bordered"
                placeholder="Enter RMB Rate"
              />
              {errors.rmbRate && (
                <span className="text-red-500">{errors.rmbRate.message}</span>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Transport Cost*</span>
              </label>
              <input
                type="number"
                value={transportCost}
                {...register("transportCost", {
                  required: "Transport Cost is required",
                  min: {
                    value: 0,
                    message: "Transport Cost cannot be negative",
                  },
                })}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setTransportCost(e.target.value)}
                className="textarea textarea-bordered"
                placeholder="Enter Transport Cost"
              />
              {errors.transportCost && (
                <span className="text-red-500">
                  {errors.transportCost.message}
                </span>
              )}
            </div>
          </div>
          {/* Fifth Row  */}
          <div className="flex gap-x-4 mb-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Product Cost*</span>
              </label>
              <input
                type="number"
                value={productCost}
                {...register("productCost", {
                  min: {
                    value: 0,
                    message: "product Cost cannot be negative",
                  },
                })}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setProductCost(e.target.value)}
                className="textarea textarea-bordered"
                placeholder="Enter Transport Cost"
              />
              {errors.productCost && (
                <span className="text-red-500">
                  {errors.productCost.message}
                </span>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Product Price*</span>
              </label>
              <input
                type="number"
                value={productPrice}
                {...register("productPrice", {
                  required: "Adjustment is required",
                  min: {
                    value: 0,
                    message: "Product Price cannot be negative",
                  },
                })}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setProductPrice(e.target.value)}
                className="textarea textarea-bordered"
                placeholder="Enter Product Price"
              />
              {errors.productPrice && (
                <span className="text-red-500">
                  {errors.productPrice.message}
                </span>
              )}
            </div>
          </div>
          {/* Sixth row  */}
          {/* Date */}
          <div className="form-control w-1/2">
            <div className="label">
              <span className="label-text">Date*</span>
            </div>
            <input
              type="date"
              {...register("date", {})}
              className="textarea textarea-bordered"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
            {errors.date && (
              <span className="text-red-500">{errors.date.message}</span>
            )}
          </div>
          {/* Submit Button */}
          <div>
            <button className="btn btn-active btn-ghost my-4" type="submit">
              UPDATE <FaPlusSquare />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProducts;
