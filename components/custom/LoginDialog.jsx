import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { signIn } from '@/store/authSlice';

function LoginDialog({openDialog, closeDialog}) {
  const dispatch = useDispatch();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: 'Bearer '+tokenResponse?.access_token } },
      );
  
      console.log(userInfo);
      const res = await axios.post('/api/auth', {
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture,
      });
       dispatch(signIn(userInfo?.data));
       localStorage.setItem('user', JSON.stringify(res.data));
       closeDialog(false);
    },
    onError: errorResponse => console.log(errorResponse),
  });
  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
   
    <DialogContent>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription >
          <div className='flex flex-col items-center justify-center gap-3'>
          <h2 className='font-bold text-2xl text-center text-white'>{Lookup.SIGNIN_HEADING}</h2>
          <p className='mt-2 text-center'>{Lookup.SIGNIN_SUBHEADING}</p>
          <Button className='bg-blue-500 text-white hover:bg-blue-400 mt-3' onClick={googleLogin}> SignIn</Button>
          <p>{Lookup?.SIGNIn_AGREEMENT_TEXT}</p>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  
  )
}

export default LoginDialog