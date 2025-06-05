import { Mutation, QueryClient, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/authContext";

export function useCreateCommentMutation(){
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn: async({postId,content})=>{
            const data=await axios.post(`/api/comments/${postId}`,{content});
            return data.data;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['posts'])
        },
        onError:(error)=>{
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               "Failed to delete comment";
            console.error("Delete error:", errorMessage);
        }
    })
}

export function useDeleteCommentMutation(){
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:async(commentId)=>{
            const res=await axios.delete(`/api/comments/${commentId}`)
            return res
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['posts'])
        }
    })
}