import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Custom hook to fetch categories
const useCategories = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch categories using useQuery
  const { data: categories = [], refetch, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosPublic.get("/category");
      return response.data;
    },
  });

  return [categories, refetch, isPending]; // Return categories data
};

export default useCategories;
