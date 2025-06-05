import { Mutation, QueryClient, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/authContext";



export const createPost=async(postData)=>{
    const {data}=await axios.post('/api/posts',postData);
    return data;
}

export function useCreatePostMutation(){
    return useMutation({
        mutationFn:createPost
    })
}

export const getActivePosts=async()=>{
    const data=await axios.get('/api/posts/active');
    return data;
}

export function usePostsQuery(){
    return useQuery({
        queryKey:['posts'],
        queryFn: getActivePosts,
    })
}

export function useGetMyPostsQuery(){
  return useQuery({
    queryKey:['myPosts'],
    queryFn: async()=> {
      const data = axios.get('/api/posts/my-posts')
      return data;
    }
  })
}


export function useBlockedPostsQuery(){
  return useQuery({
      queryKey:['blockedPosts'],
      queryFn: async()=> axios.get('/api/posts/blocked')
  })
}


export function useLikedPostsQuery(){
    return useQuery({
        queryKey:['likedPosts'],
        queryFn: async()=> axios.get('/api/posts/liked')
    })
}



export function useEditPostMutation(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async(postData)=>{
      const {data}=await axios.put(`/api/posts/${postData.postId}`,postData);
      return data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(['posts'])
    }
  })
}

export function useDeletePostMutation(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async(postId)=>{
      const {data}=await axios.delete(`/api/posts/${postId}`);
      return data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(['posts'])
    }
  })
}

export function useModeratePostMutation(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async(postId)=>{
      const {data}=await axios.patch(`/api/posts/${postId}`);
      return data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(['posts'])
    }
  })
}