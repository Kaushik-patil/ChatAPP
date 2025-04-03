import {create} from 'zustand'
import toast from 'react-hot-toast'
import {axiosInstance} from '../lib/axios'
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get)=>({
messages :[],
users:[],
selectedUser:null,
isUserLoading:false,
isMessagesLoading:false,

getUsers:async()=>{
    set({isUserLoading:true});
    try{
   const res = await axiosInstance.get('/messages/users');
   set({users : res.data});
    }catch(error){
    toast.error(error.response.data.message);   
    }finally{
       set({isUserLoading:false});
    }
},

getMessages : async(userId)=>{
    set({isMessagesLoading:true});
    try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({messages:res.data});
    } catch (error) {
        toast.error(error.response.data.message);
    }
    finally{
        set({isMessagesLoading:false});
    }
}
,

sendMessage : async (messagedata)=>{
    const {messages,selectedUser} = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messagedata);
      set({messages:[...messages,res.data]}) 
    } catch (error) {
        toast.error(error.response.data.message);
    }
},

subscribeToMessages : async()=>{
    const{selectedUser} = get();

    if(!selectedUser) return;
 
    const socket = useAuthStore.getState().socket;
 //todo:optimize this later
    socket.on('newMessage',(newMessage)=>{
      const isMessageSentFromSelectedUser = newMessage.senderId == selectedUser._Id;
        if(!isMessageSentFromSelectedUser) return ;
        set({messages:[...get().messages,newMessage],})
    })

},

unSubscribeFromMessages:async()=>{
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
},

//todo: optimse this later // no need
setSelectedUser : (selectedUser)=> set ({selectedUser}),

}));