"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useParams } from 'next/navigation';
import SandpackPreviewClient from "./SandpackPreviewClient";
import { Button } from "../ui/button";
import { Loader2Icon, LucideDownload, Rocket } from "lucide-react";
import { setActivity } from "@/store/activitySlice";

function CodeView() {
  const [activeTab, setActiveTab]=useState('code');
  const[files,setFiles]=useState(Lookup.DEFAULT_FILE)
  const messages = useSelector((state) => state.chat.messages);
  const [previewKey, setPreviewKey] = useState(0);
  const dispatch = useDispatch();
  const [codeLoading, setCodeLoading] = useState(false);



    const handleTrigger = (name) => {
      dispatch(setActivity({
        action: name, // e.g., 'ex'
        date: new Date().toISOString()
      }));
    };
 
const params = useParams();
const workId = params.workId;


useEffect(() => {
 
  const fetchFiles = async () => {
    try {
      const res = await axios.get(`/api/work/${workId}`);
      const data = res.data;
  
      
  
      if (data.files) {
        const mergeFiles = { ...Lookup.DEFAULT_FILE, ...data.files };
        setFiles(mergeFiles);
      }
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };
  
  

  fetchFiles();
}, [workId]);
const triggeredRef = useRef(false);

useEffect(() => {
  
  if (messages?.length > 0) {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.role === 'user' && !triggeredRef.current) {
      
      triggeredRef.current = true;
      GenerateAiCode();
    }

    if (lastMessage.role === 'ai') {
      triggeredRef.current = false; 
      
    }
  }
}, [messages]);


  const GenerateAiCode = async () => {
    setCodeLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    try {
     const PROMPT = messages.map(m => `${m.role.toUpperCase()}: ${m.message}`).join('\n') + '\n' + Prompt.CODE_GEN_PROMPT;

      
  
      const result = await axios.post('/api/gen-ai-code', {
        prompt: PROMPT,
      });
      
      
      const aiResp = result.data;
      
    
      if (aiResp?.files && Object.keys(aiResp.files).length > 0) {
       
        
        
        
        
        
      
        const mergeFiles = { ...Lookup.DEFAULT_FILE, ...aiResp.files };
        setFiles(mergeFiles);
        
        try {
         
          
          const patchRes = await axios.patch(`/api/work/${workId}`, {
            files: aiResp?.files,
          });
          
          
          setTimeout(async () => {
            try {
              const verifyRes = await axios.get(`/api/work/${workId}`);
             
            } catch (verifyErr) {
              console.error("Verification GET failed:", verifyErr);
            }
          }, 1000);
        } catch (patchErr) {
          console.error("PATCH request failed:", patchErr.response?.data || patchErr.message);
        }
      } else {
        console.warn("No files received from AI or empty files object");
      }
    } catch (error) {
      const status = error?.response?.status;
    if (status === 503) {
      alert("The AI service is currently unavailable (503). Please try again shortly.");
    } else {
      console.error("GenerateAiCode Error:", error?.response?.data || error.message);
    }
    }
    finally {
      setCodeLoading(false); // stop loading
    }
  };
  
  return (
    <div>
     <div className="bg-[#181818] w-full p-2 border flex justify-between">
      <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center  rounded-full " >
        <h2 onClick={()=>setActiveTab('code')} className={`text-sm cursor-pointer ${activeTab=='code' &&'text-blue-500 bg-blue-950 bg-opacity-25 p-1 px-2 rounded-full'}`}>
          Code
        </h2>
        <h2 onClick={()=>{setActiveTab('preview'); setPreviewKey(prev => prev + 1);}}  
   className={`text-sm cursor-pointer ${activeTab=='preview' &&'text-blue-500 bg-blue-950 bg-opacity-25 p-1 px-2 rounded-full'}`}>
          Preview
        </h2>
      </div>{activeTab=='preview' &&
      <div className="flex  shrink-0 bg-black p-1  gap-3 justify-center  rounded-full ">
        <Button variant='ghost' className='rounded-full' onClick={() => handleTrigger('export')}><LucideDownload/>Export</Button>
        <Button variant='ghost'className='rounded-full'onClick={() => handleTrigger('deploy')}><Rocket></Rocket>Deploy</Button>
      </div>}
     </div>
     {codeLoading ? (
  <div className="h-[80vh] flex items-center justify-center text-white text-lg">
    <Loader2Icon className="animate-spin pr-1"/>
     Generating your project...
  </div>
) : (
      <SandpackProvider key={previewKey} files={files} template="react" theme={"dark"} customSetup={{
        dependencies:{
          ...Lookup.DEPENDANCY
        }
      }}
      options={{
        externalResources:['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4']
      }} >
        <SandpackLayout>
          {activeTab=='code'&&<>
          <SandpackFileExplorer style={{ height: "80vh" }} />
          <SandpackCodeEditor style={{ height: "80vh" }} />
          </>}
          {activeTab === "preview" &&
          <>
          <SandpackPreviewClient></SandpackPreviewClient>
          </>}
        </SandpackLayout>
      </SandpackProvider>
      )}
    </div>
  );
}

export default CodeView;


 