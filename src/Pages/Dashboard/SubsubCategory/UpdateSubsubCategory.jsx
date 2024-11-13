import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { FaUtensils } from "react-icons/fa";
import Swal from "sweetalert2";
import useSubcategory from "../../../Hooks/useSubcategory";

const UpdateSubsubCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();
  const Navigate = useNavigate();

  const [subcategories] = useSubcategory();

  const subsubcategories = useLoaderData();
  const { _id: id, name, subcategoryName } = subsubcategories?.[0] || {};
  console.log(id, name, subcategoryName);

  const onSubmit = async (data) => {
    const subsubcategoryItem = {
      name: data.name,
      subcategoryName: data.subcategoryName,
    };
    try {
      const Response = await axiosPublic.patch(
        `/subsubcategory/${id}`,
        subsubcategoryItem
      );
      if (Response.data.modifiedCount > 0) {
        // Show success popup
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.name} is updated successfully.`,
          showConfirmButton: false,
          timer: 1500,
        });
        // Reset the form fields
        reset();
        Navigate("/dashboard/manage-subsubcategory");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `Failed to update ${data.name}. Please try again.`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div className="m-12">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-x-4 mb-4">
          {/* Subsububcategory id */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Sub Subcategory Id*</span>
            </label>
            <input
              type="text"
              defaultValue={id}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          {/* Sub Subcategory name */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Sub Subcategory Name*</span>
            </label>
            <input
              type="text"
              defaultValue={name}
              {...register("name", { required: true })}
              className="input input-bordered w-full"
            />
          </div>
          {/* Current Subcategory  Name*/}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Current Subcategory*</span>
            </label>
            <input
              type="text"
              disabled
              defaultValue={subcategoryName}
              className="input input-bordered w-full"
            />
          </div>
          {/*Update Subcategory Dropdown  */}
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Change Subcategory*</span>
            </div>
            <select
              defaultValue={subcategoryName}
              {...register("subcategoryName")}
              className="textarea textarea-bordered"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((item) => (
                <option key={item._id} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.subcategoryName && (
              <span className="text-red-500">
                {errors.subcategoryName.message}
              </span>
            )}
          </div>
        </div>
        {/* Button */}
        <div>
          <button className="btn btn-active btn-primary my-4">
            Submit <FaUtensils className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSubsubCategory;
