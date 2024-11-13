import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useCustomers = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch categories using useQuery
  const {
    data: customers = [],
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await axiosPublic.get("/customers");
      return response.data;
    },
  });

  return [customers, refetch, isPending];
};

export default useCustomers;
