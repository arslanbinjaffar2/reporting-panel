'use client';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useAppSelector } from '@/redux/hooks/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Loader';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const user = useAppSelector((state)=>state.authUser.user);
  const router = useRouter();
  useEffect(() => {
    if(user !== null){
      router.push("/manage/events");
    }else{
      router.push("/auth/login");
    }
  }, []);
  return (
    <>
      <Loader className='' fixed=''/>
    </>
  );
}
