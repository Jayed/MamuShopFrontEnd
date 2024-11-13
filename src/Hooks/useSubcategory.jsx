import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useSubcategory = () => {
  const axiosPublic = useAxiosPublic();
  // Fetch Subcategories using useQuery
  const {
    data: subcategories = [],
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["subcategory"],
    queryFn: async () => {
      const response = await axiosPublic.get("/subcategory");
      return response.data;
    },
  });

  return [subcategories, refetch, isPending]; // Return categories data
};

export default useSubcategory;
