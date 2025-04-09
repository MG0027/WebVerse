"use client"
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup'
import { setInput } from '@/store/userInputSlice';
import { ArrowBigRight, Link } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoginDialog from './LoginDialog';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { addToWorkHistory } from '@/store/workSlice';

function Hero() {
  const router = useRouter()
  const [userInput, setUserInput] =useState();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const [openDialog, setOpenDialog] = useState(false);
  const handleSubmit = async (userInput) => {
    if(!isLoggedIn){
      setOpenDialog(true);
      return;
    }
   
    try {
     
      const res = await axios.post('/api/work', {
        userId: user.uuid,
      firstInput: userInput,
      files:{}
      });

      const work = res.data;
      console.log(work);
      dispatch(setInput(userInput));
      router.push(`/work/${work.workId}`);
      const historyRes = await axios.get(`/api/work?userId=${user.uuid}`);
    const history = historyRes.data.data;

    console.log("Fetched history:", history);

    
    dispatch(addToWorkHistory(history));
      
      
    } catch (error) {
      console.error("Error saving input:", error);
    }
  };

  return (
    <div >
    <div className='flex flex-col items-center mt-30 xl:mt-30 gap-2'>
      <h2 className='font-bold text-4xl'>{Lookup.HERO_HEADING}</h2>
      <p className='text-gray-400 font-medium'> {Lookup.HERO_DESC}</p>
      <div className='p-5 border rounded-xl max-w-2xl w-full mt-3' style={{backgroundColor:Colors.BACKGROUND}}>
      <div className='flex gap-2'>
        <textarea placeholder={Lookup.INPUT_PLACEHOLDER} className='outline-none bg-transparent w-full h-32 max-h-56 resize-none' onChange={(event)=>setUserInput(event.target.value)}></textarea>
         {userInput && <ArrowBigRight className='bg-blue-950 p-2 h-8 w-8 rounded-md cursor-pointer' onClick={()=>(handleSubmit(userInput))}></ArrowBigRight>}
      </div>
      <div>
      <Link className='h5 w-5'></Link>
      </div>
      </div>
      <div className='flex flex-wrap max-w-2xl items-center justify-center gap-3'>
        {Lookup?.SUGGSTIONS.map((suggestion,index)=>(<h2 key={index} className='p-1 px-2 border rounded-full text-sm text-gray-500 hover:text-white cursor-pointer' onClick={()=>{handleSubmit(suggestion)}}>{suggestion}</h2>))}
      </div>
      <LoginDialog openDialog={openDialog} closeDialog={(v)=>{setOpenDialog(false)}}/>
    </div>
    </div>
  )
}

export default Hero