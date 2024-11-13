import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Testing = () => {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [cost, setCost] = useState(0);

  // Watch the "numberOfProducts" and "price" fields for changes
  const numberOfProducts = watch("numberOfProducts", 0);
  const price = watch("price", 0);

  // Update cost whenever numberOfProducts or price changes
  React.useEffect(() => {
    const calculatedCost = numberOfProducts * price;
    setCost(calculatedCost);
    setValue("cost", calculatedCost); // Update the cost field
  }, [numberOfProducts, price, setValue]);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Number of Products */}
      <div>
        <label>Number of Products</label>
        <input
          type="number"
          {...register("numberOfProducts", { required: true })}
          className="input input-bordered w-full"
        />
      </div>

      {/* Price */}
      <div>
        <label>Price</label>
        <input
          type="number"
          {...register("price", { required: true })}
          className="input input-bordered w-full"
        />
      </div>

      {/* Cost (calculated field) */}
      <div>
        <label>Cost</label>
        <input
          type="number"
          {...register("cost")}
          value={cost}
          onChange={(e) => setCost(e.target.value)} // Allow manual editing if necessary
          className="input input-bordered w-full"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Testing;
