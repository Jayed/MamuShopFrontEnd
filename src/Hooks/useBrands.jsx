import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Custom hook to fetch brands
const useBrands = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch brands using useQuery
  const {
    data: brands = [],
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await axiosPublic.get("/brands");
      return response.data;
    },
  });

  return [brands, refetch, isPending]; // Return brands data
};

export default useBrands;
