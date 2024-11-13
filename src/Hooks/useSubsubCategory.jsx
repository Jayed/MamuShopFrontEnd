import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useSubsubCategory = () => {
  const axiosPublic = useAxiosPublic();
  // Fetch Subcategories using useQuery
  const {
    data: subsubcategories = [],
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["subsubcategory"],
    queryFn: async () => {
      const response = await axiosPublic.get("/subsubcategory");
      return response.data;
    },
  });

  return [subsubcategories, refetch, isPending]; // Return categories data
};

export default useSubsubCategory;
