"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowBigRight, Link, Loader2Icon, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import ReactMarkdown from "react-markdown";
import { useDispatch} from "react-redux";
import { addMessage, setMessages } from "@/store/chatSlice";


function ChatView() {
  const { workId } = useParams(); 
  
  const messages = useSelector((state) => state.chat.messages);
const dispatch = useDispatch();

 
 const [userInput, setUserInput] =useState();
 const [loading,setLoading] =useState(false);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/work/${workId}`);
        console.log(res.data.inputs);
        dispatch(setMessages(res.data.inputs))
        if (res.data.inputs.length === 1 && res.data.inputs[0].role === 'user') {
          GetAiRes(res.data.inputs[0].message);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    if (workId) fetchMessages();
    
  }, [workId]);

 
  
  console.log(messages);

  const handleSubmit = async (input) => {
    dispatch(addMessage({
      role: 'user',
      message: input,
    }));
    setUserInput(""); // Clear the textarea
    const newUserMessage = {
      role: "user",
      message: input,
    };
  
    try {
      await axios.patch(`/api/work/${workId}`, {
        input: newUserMessage,
      });
      console.log(input);
      GetAiRes(input);
    } catch (err) {
      console.error("Failed to store user message:", err);
    }
  };
  
  
  const GetAiRes = async (currentMessages) => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(currentMessages) + Prompt.CHAT_PROMPT;
      const res = await axios.post('/api/ai-chat', { prompt: PROMPT });
  
      const aiResponse = {
        message: res.data.result,
        role: 'ai',
      };
      dispatch(addMessage({
        role: 'ai',
        message: res.data.result,
      }));
      // Save AI response to DB
      await axios.patch(`/api/work/${workId}`, {
        input: aiResponse,
      });
  
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (

    <div className="relative h-[85vh] flex flex-col scrollbar-hide"  style={{
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    }}>
      <div className="flex-1 overflow-y-scroll scrollbar-hide"  style={{
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}>
      {messages.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded-lg mb-2 flex gap-2 items-center leading-7 ${
        msg.role === "user" ? "bg-blue-950 text-left" : "text-left"
      }`}  style={msg.role === "ai" ? { backgroundColor: "#272727" } : {}}>
            <ReactMarkdown className="flex flex-col">{msg?.message}</ReactMarkdown>
           
      </div>))}
      {loading &&<div className="p-3 rounded-lg mb-2 flex gap-2 items-center" style={{backgroundColor:Colors.CHAT_BACKGROUND}}>
              <Loader2Icon className="animate-spin"/>
              <h2>Generating Response....</h2>
              </div>}
    </div>
     <div className='p-5 border rounded-xl max-w-2xl w-full mt-3' style={{backgroundColor:Colors.BACKGROUND}}>
          <div className='flex gap-2'>
            <textarea value={userInput} placeholder={Lookup.INPUT_PLACEHOLDER} className='outline-none bg-transparent w-full h-32 max-h-56 resize-none' onChange={(event)=>setUserInput(event.target.value)}></textarea>
             {userInput && <ArrowBigRight className='bg-blue-950 p-2 h-8 w-8 rounded-md cursor-pointer' onClick={()=>(handleSubmit(userInput))}></ArrowBigRight>}
          </div>
          <div>
          <Link className='h5 w-5'></Link>
          </div>
          </div>
    </div>
  );
}

export default ChatView;

    // <div className="flex flex-col gap-4 h-full p-4 overflow-y-auto">
    //   <div className="flex-1 space-y-3 overflow-y-scroll max-h-[70vh] border rounded-md p-4">
    //     {messages.length > 0 ? (
    //       messages.map((msg, idx) => (
    //         <div key={idx} className="bg-muted p-2 rounded-md shadow-sm">
    //           <p className="text-sm">{msg?.message}</p>
    //           <p className="text-xs text-gray-400">
    //           {msg?.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
    //           </p>
    //         </div>
    //       ))
    //     ) : (
    //       <p className="text-muted-foreground">No messages yet.</p>
    //     )}
    //   </div>

    //   {/* Chat input */}
    //   <div className="flex gap-2 items-end mt-4">
    //     <textarea
    //       rows={2}
    //       placeholder="Type your message..."
    //       value={newMsg}
    //       onChange={(e) => setNewMsg(e.target.value)}
    //       className="flex-1 resize-none"
    //     />
    //     <Button onClick={handleSend}>
    //       <SendHorizonal className="h-4 w-4" />
    //     </Button>
    //   </div>
    // </div>

    // const  handleSend = async () => {
      //   if (!newMsg.trim()) return;
    
      //   const newMessage = {
      //     message: newMsg,
      //   };
    
      //   try {
      //     console.log(newMessage);
      //     const res = await axios.patch(`/api/work/${workId}`, {
      //        input: newMsg,
      //     });
    
      //     console.log(res.data.inputs);
          
      //     setMessages((prev) => [...prev, res.data.inputs.at(-1)]);
      //     setNewMsg("");
    
      //   } catch (err) {
      //     console.error("Error sending message:", err);
      //   }
      // };