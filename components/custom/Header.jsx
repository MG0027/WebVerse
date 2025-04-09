import Colors from '@/data/Colors'
import React from 'react'
import { Button } from '../ui/button'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '@/store/authSlice'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useRouter } from 'next/navigation'

function Header() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const dispatch = useDispatch()
 const router= useRouter();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

       
        const res = await axios.post('/api/auth', {
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
        });

        dispatch({ type: 'auth/signIn', payload: res.data });
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        console.error("Login failed", err);
      }
    },
    onError: (error) => {
      console.error("Login Error:", error);
    },
  });

  const handleLogout = () => {
    dispatch(signOut());
    localStorage.removeItem('user');
    router.push('/');
  };

  
    const handleClick = () => {
      router.push('/')
    }

  return (
    <div className='p-4 flex justify-between items-center'>
      <h1 className='text-2xl font-extrabold tracking-wide cursor-pointer' onClick={handleClick}>W</h1>
      <div className='flex gap-5'>
        {isLoggedIn ? (
          <Button variant='ghost' onClick={handleLogout}>Log Out</Button>
        ) : (
          <Button variant='ghost' onClick={() => googleLogin()}>Sign In</Button>
          
        )}
       
      </div>
    </div>
  )
}

export default Header
