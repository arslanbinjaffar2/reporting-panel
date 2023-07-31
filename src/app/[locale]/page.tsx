'use client';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useAppSelector } from '@/redux/hooks/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Loader';

const inter = Inter({ subsets: ['latin'] })

export default function Home({params: {locale}}:any) {
  const user = useAppSelector((state)=>state.authUser.user);
  const router = useRouter();
  useEffect(() => {
    if(user !== null){
      console.log(`/${locale}/auth/login`);
      router.push(`/${locale}/manage/events`);
    }else{
      router.push(`/${locale}/auth/login`);
    }
  }, []);
  return (
    <>
      <Loader className='' fixed=''/>
    </>
  );
}
