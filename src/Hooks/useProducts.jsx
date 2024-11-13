import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useProducts = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch categories using useQuery
  const {
    data: products = [],
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosPublic.get("/products");
      return response.data;
    },
  });

  return [products, refetch, isPending];
};

export default useProducts;
