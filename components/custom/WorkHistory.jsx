'use client'
import { setWorkHistory } from '@/store/workSlice';
import Link from 'next/link';


import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSidebar } from '../ui/sidebar';

function WorkHistory() {
   const userId = useSelector((state) => state.auth.user);
  //  const [works, setWorks] = useState([]);
 
   const dispatch = useDispatch();
   const workHistory = useSelector((state) => state.work.history);
  console.log(userId?.uuid);
   useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch(`/api/work?userId=${userId.uuid}`);
        const data = await res.json();
        console.log(data);
        if (data.success) {
          dispatch(setWorkHistory(data.data));
          // setWorks(data.data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch work history:', error);
      }
    };

    if (userId) {
      fetchWorks();
    }
  }, [userId,dispatch]);
  console.log("Fetched works: ", workHistory);

  return (
    <div>
      <h2 className='font-medium text-lg'>Your Chats</h2>
      {/* <aside className="sidebar">
      {workHistory.map((work) => (
        
        <div key={work.workId} className="work-item">
          <p className="text-white">{work.inputs?.[0].message || 'No message'}</p>
          <small className="text-gray-400">{work.workId}</small>
        </div>
      ))}
    </aside> */}
    <div>
    {workHistory.map((work) => (
        <Link href={'/work/'+work.workId} key={work.workId} >
        <h2  className="text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white" >
          {work.inputs?.[0].message || 'No message'}</h2>
          </Link>
  )
    )}
    </div>
    </div>
  )
}
export default WorkHistory;