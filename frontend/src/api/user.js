import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
const USERS_URL='/api/users'

export const loginUser = async (credentials) => {
    const res = await fetch(`${USERS_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Login failed');

    return data;
  };
  
  export const logoutUser = async () => {
    const res = await fetch(`${USERS_URL}/logout`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Logout failed');
  };
  
  export const registerUser = async (userData) => {
    const res = await fetch(`${USERS_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Register failed');
    return res.json();
  };
  
  export const updateUser = async (userData) => {
    const res = await fetch(`${USERS_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  };
  
  export const getCurrentUser = async () => {
    const res = await fetch(`${USERS_URL}/me`);
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  };

  export function useUpdateUserMutation() {
    return useMutation({
      mutationFn: async (userData) => {
        const { data } = await axios.put("/api/users/profile", userData);
        return data;
      },
    });
  }

export function useGetAllUsersQuery(){
  return useQuery({
    queryKey:['users'],
    queryFn: async()=>{
      const {data}=await axios.get('/api/users/all')
      return data
    }
  })
}

export function useDeleteUserMutation(){
  const queryClient=useQueryClient()
  return useMutation({
    mutationFn: async(userId)=>{
      const {data}=await axios.delete(`/api/users/${userId}`);
      return data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(['users'])
    }
  })
}

export function useToggleUserStatusMutation(){
  const queryClient=useQueryClient()
  return useMutation({
    mutationFn: async(userId)=>{
      const {data}=await axios.patch(`/api/users/${userId}`);
      return data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(['users'])
    }
  })
}