// Replace with modal 

// import { Link, useLoaderData } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";
// import { FaUtensils } from "react-icons/fa";
// import useAxiosPublic from "../../../Hooks/useAxiosPublic";
// import { useNavigate } from "react-router-dom";

// const UpdateCategory = () => {
//   const category = useLoaderData();
//   const { register, handleSubmit, reset } = useForm();
//   const axiosPublic = useAxiosPublic();
//   const Navigate = useNavigate();

//   const { _id: id, name } = category?.[0];

//   const onSubmit = async (data) => {
//     const categoryItem = {
//       name: data.name,
//     };
//     try {
//       const categoryRes = await axiosPublic.patch(
//         `/category/${id}`,
//         categoryItem
//       );
//       if (categoryRes.data.modifiedCount > 0) {
//         // Show success popup
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: `${data.name} is updated successfully.`,
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         // Reset the form fields
//         reset({ name: data.name });
//         Navigate("/dashboard/manage-category");
//       }
//     } catch (error) {
//       console.error("Error updating category:", error);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: `Failed to update ${data.name}. Please try again.`,
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }
//   };

//   return (
//     <div className="m-12">
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="flex gap-x-4 mb-4">
//           {/* Category id */}
//           <div className="form-control w-full mb-4">
//             <label className="label">
//               <span className="label-text">Category Id*</span>
//             </label>
//             <input
//               type="text"
//               defaultValue={id}
//               disabled
//               className="input input-bordered w-full"
//             />
//           </div>
//           {/* Category name */}
//           <div className="form-control w-full mb-4">
//             <label className="label">
//               <span className="label-text">Category Name*</span>
//             </label>
//             <input
//               type="text"
//               defaultValue={name}
//               {...register("name", { required: true })}
//               className="input input-bordered w-full"
//             />
//           </div>
//         </div>
//         {/* Button */}
//         <div>
//           <button className="btn btn-active btn-primary my-4">
//             Submit <FaUtensils className="ml-2" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateCategory;
