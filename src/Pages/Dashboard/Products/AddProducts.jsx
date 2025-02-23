import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { FaPlusSquare } from "react-icons/fa";
import Swal from "sweetalert2";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubsubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // calling useAxiosPublic hook
  const axiosPublic = useAxiosPublic();

  // Watch selected category and subcategory values from the form
  const selectedCategory = watch("category");
  const selectedSubCategory = watch("subCategory");

  // States for cost and price calculation
  const [costRMB, setCostRMB] = useState();
  const [rmbRate, setRmbRate] = useState();
  const [transportCost, setTransportCost] = useState();
  const [productCost, setProductCost] = useState("");
  const [productPrice, setProductPrice] = useState("");

  //Not a good way, showing some error
  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full space-y-2 mt-12">
  //       <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
  //       <p className="text-blue-500 text-lg font-semibold">
  //         Loading sales data...
  //       </p>
  //     </div>
  //   );
  // }

  // Category
  useEffect(() => {
    axiosPublic.get("/category").then((response) => {
      setCategories(response.data);
    });
  }, []);
  // subcategories
  useEffect(() => {
    if (selectedCategory) {
      axiosPublic.get(`/subcategory2/${selectedCategory}`).then((response) => {
        setSubCategories(response.data);
        setSubsubCategories([]);
        setValue("subCategory", "");
        setValue("subsubCategory", "");
      });
    }
  }, [selectedCategory, setValue]);
  // sub-subcategories
  useEffect(() => {
    if (selectedSubCategory) {
      axiosPublic
        .get(`/subsubcategory2/${selectedSubCategory}`)
        .then((response) => {
          setSubsubCategories(response.data);
          setValue("subSubCategory", "");
        });
    }
  }, [selectedSubCategory, setValue]);
  // brands
  useEffect(() => {
    axiosPublic.get("/brands").then((response) => {
      setBrands(response.data);
    });
  }, []);

  // Sort category,  subcategory and subsubcategory
  // Sort categories alphabetically by name
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  // Sort subCategories by category name first, then by subcategory name
  const sortedSubCategories = [...subCategories].sort((a, b) => {
    const categoryComparison = a.categoryName.localeCompare(b.categoryName);
    if (categoryComparison !== 0) {
      return categoryComparison; // If categories are different, sort by category
    }
    return a.name.localeCompare(b.name); // If categories are the same, sort by subcategory name
  });
  // Sort subsubcategories by subcategory name first, then by subsubcategory name
  const sortedSubsubcategories = [...subsubCategories].sort((a, b) => {
    const subcategoryComparison = a.subcategoryName.localeCompare(
      b.subcategoryName
    );
    if (subcategoryComparison !== 0) {
      return subcategoryComparison;
    }
    return a.name.localeCompare(b.name);
  });

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

  // Check for duplicate product
  const checkDuplicate = async (productDetails) => {
    try {
      const response = await axiosPublic.post(
        "/products/check-duplicate",
        productDetails
      );
      return response.data.duplicate;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return false;
    }
  };
  // Handle form submission
  const onSubmit = async (data) => {
    const productDetails = {
      category: data.category,
      subCategory: data.subCategory,
      subsubCategory: data.subsubCategory,
      brand: data.brand,
    };

    const isDuplicate = await checkDuplicate(productDetails);

    if (isDuplicate) {
      return Swal.fire(
        "Duplicate Product",
        "This product already exists.",
        "warning"
      );
    }

    const ProductDetails = {
      ...productDetails,
      inStock: parseInt(data.productQuantity, 10), // Product quantity will be inStock
      stockAlert: parseInt(data.stockAlert, 10),
      costRMB: parseFloat(data.costRMB),
      rmbRate: parseFloat(data.rmbRate),
      transportCost: parseFloat(data.transportCost),
      productCost: parseFloat(productCost),
      productPrice: parseFloat(productPrice),
      date: data.date,
    };

    try {
      setIsLoading(true);
      const productRes = await axiosPublic.post("/products", ProductDetails);

      if (productRes.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.category} is added successfully.`,
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        navigate("/dashboard/manage-products");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div>
      <SectionTitle
        subHeading="Provide all information about the new product"
        heading="ADDING NEW PRODUCT"
      />
      <div className="p-16">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-2 mt-12">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
            <p className="text-blue-500 text-lg font-semibold">
              Loading data...
            </p>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* First row -- Category, sub and Subsub */}
              <div className="flex gap-x-4 mb-4">
                {/* Category  */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-cyan-900">Category*</span>
                  </label>
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })} // Add required validation
                    className="textarea textarea-bordered"
                  >
                    <option value="">Select Category</option>
                    {sortedCategories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-red-500">
                      {errors.category.message}
                    </span> // Display error message
                  )}
                </div>
                {/* sub-category  */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-cyan-900">Sub-category*</span>
                  </label>
                  <select
                    {...register("subCategory", {
                      required: "Sub-category is required",
                    })} // Add required validation
                    className="textarea textarea-bordered"
                    disabled={!selectedCategory} // Disable if no category selected
                  >
                    <option value="">Select SubCategory</option>
                    {sortedSubCategories.map((subCategory) => (
                      <option key={subCategory._id} value={subCategory.name}>
                        {subCategory.name}
                      </option>
                    ))}
                  </select>
                  {errors.subCategory && (
                    <span className="text-red-500">
                      {errors.subCategory.message}
                    </span> // Display error message
                  )}
                </div>
                {/* subsubcategory  */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-cyan-900">Sub-subcategory*</span>
                  </label>
                  <select
                    {...register("subsubCategory", {
                      required: "Sub-subcategory is required",
                    })} // Add required validation
                    className="textarea textarea-bordered"
                    disabled={!selectedSubCategory} // Disable if no subCategory selected
                  >
                    <option value="">Select Sub-subcategory</option>
                    {sortedSubsubcategories.map((subsubCategory) => (
                      <option
                        key={subsubCategory._id}
                        value={subsubCategory.name}
                      >
                        {subsubCategory.name}
                      </option>
                    ))}
                  </select>
                  {errors.subsubCategory && (
                    <span className="text-red-500">
                      {errors.subsubCategory.message}
                    </span> // Display error message
                  )}
                </div>
              </div>
              {/* Second Row  */}
              <div className="flex gap-x-4 mb-4">
                {/* Brands Dropdown  */}
                <div className="form-control w-4/12">
                  <div className="label">
                    <span className="label-text text-cyan-900">Brands*</span>
                  </div>
                  <select
                    {...register("brand", { required: "Brand is required" })} // Add required validation
                    className="textarea textarea-bordered"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {errors.brand && (
                    <span className="text-red-500">{errors.brand.message}</span> // Display error message for brand
                  )}
                </div>
              </div>
              {/* Third Row  */}
              <div className="flex gap-x-4 mb-4">
                {/* In-Stock */}
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-cyan-900">In-Stock*</span>
                  </div>
                  <input
                    type="number"
                    defaultValue={0}
                    readOnly
                    className="textarea textarea-bordered bg-gray-100"
                  />
                </div>
                {/* Product Quantity */}
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-cyan-900">Product Quantity*</span>
                  </div>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    {...register("productQuantity", {
                      required: "Product Quantity is required", // Required validation
                      valueAsNumber: true, // Ensure the value is treated as a number
                    })}
                    className="textarea textarea-bordered"
                    placeholder="Product Quantity"
                  />
                  {errors.productQuantity && (
                    <span className="text-red-500">
                      {errors.productQuantity.message}{" "}
                      {/* Error message for required field */}
                    </span>
                  )}
                </div>

                {/* Stock Alert */}
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-cyan-900">Stock Alert*</span>
                  </div>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    {...register("stockAlert", {
                      required: "Stock Alert is required", // Make field required
                      valueAsNumber: true, // Ensure the value is treated as a number
                    })}
                    className="textarea textarea-bordered"
                    placeholder="Stock Alert"
                  />
                  {errors.stockAlert && (
                    <span className="text-red-500">
                      {errors.stockAlert.message}{" "}
                      {/* Error message for required field */}
                    </span>
                  )}
                </div>
              </div>
              {/* Fourth Row  */}
              <div className="flex gap-x-4 mb-4">
                {/* Cost RMB */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-cyan-900">Cost RMB*</span>
                  </label>
                  <input
                    type="number"
                    value={costRMB}
                    {...register("costRMB", {
                      required: "Cost RMB is required", // Required validation
                      min: {
                        value: 0.01,
                        message: "Cost RMB must be greater than 0", // Minimum value validation
                      },
                      valueAsNumber: true, // Ensure value is treated as a number
                    })}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setCostRMB(e.target.value)}
                    className="textarea textarea-bordered"
                    placeholder="Enter Cost RMB"
                  />
                  {errors.costRMB && (
                    <span className="text-red-500">
                      {errors.costRMB.message}
                    </span>
                  )}
                </div>

                {/* RMB Rate */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-cyan-900">RMB Rate*</span>
                  </label>
                  <input
                    type="number"
                    value={rmbRate}
                    {...register("rmbRate", {
                      required: "RMB Rate is required", // Required validation
                      min: {
                        value: 0.01,
                        message: "RMB Rate must be greater than 0", // Minimum value validation
                      },
                      valueAsNumber: true, // Ensure value is treated as a number
                    })}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setRmbRate(e.target.value)}
                    className="textarea textarea-bordered"
                    placeholder="Enter RMB Rate"
                  />
                  {errors.rmbRate && (
                    <span className="text-red-500">
                      {errors.rmbRate.message}
                    </span>
                  )}
                </div>

                {/* Transport Cost */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-cyan-900">Transport Cost*</span>
                  </label>
                  <input
                    type="number"
                    value={transportCost}
                    {...register("transportCost", {
                      required: "Transport Cost is required", // Required validation
                      min: {
                        value: 0,
                        message: "Transport Cost cannot be negative", // Minimum value validation
                      },
                      valueAsNumber: true, // Ensure value is treated as a number
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
                {/* Product cost  */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-cyan-900">Product Cost*</span>
                  </label>
                  <input
                    type="number"
                    value={productCost}
                    {...register("productCost", {
                      required: "Adjustment is required",
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
                {/* Product Price  */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-cyan-900">Product Price*</span>
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
              {/* Sixth Row  */}
              {/* Date */}
              <div className="form-control w-1/2">
                <div className="label">
                  <span className="label-text text-cyan-900">Date*</span>
                </div>
                <input
                  type="date"
                  {...register("date", {})}
                  className="textarea textarea-bordered"
                  defaultValue={new Date().toISOString().split("T")[0]} // Set the current date as the default value
                />
                {errors.date && (
                  <span className="text-red-500">{errors.date.message}</span>
                )}
              </div>
              {/* Submit Button */}
              <div>
                <button className="btn btn-active btn-ghost my-4" type="submit">
                  ADDING... <FaPlusSquare />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProducts;
