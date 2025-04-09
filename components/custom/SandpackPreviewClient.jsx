import {  SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';

function SandpackPreviewClient() {
  const previewRef= useRef();
  const{sandpack} =useSandpack();
  const activity = useSelector((state) => state.activity);
  useEffect(()=>{
       getSandpackClient();
  },[sandpack &&activity])


  const getSandpackClient = async () => {
    const client = previewRef.current?.getClient();
    if (client) {
      const result = await client.getCodeSandboxURL();
      const sandboxUrl = `https://${result?.sandboxId}.csb.app/`;
  
      if (activity?.action === 'deploy') {
        window.open(result?.editorUrl, '_blank');
      } else if (activity?.action === 'export') {
        window.open(result?.editorUrl, '_blank');
      }
    }
  };
  
  return (
    <SandpackPreview ref={previewRef} style={{ height: "80vh" }} showNavigator={true} />
  )
}

export default SandpackPreviewClient