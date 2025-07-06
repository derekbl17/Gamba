import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUserBalance = (userId) => {
  return useQuery({
    queryKey: ['userBalance', userId], // Unique cache key
    queryFn: async () => {
      const res = await axios.get(`/api/users/balance/${userId}`);
      return res.data.balance; // Returns the balance (e.g., 1000.50)
    },
  });
};