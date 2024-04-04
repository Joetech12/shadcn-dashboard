import { Button, buttonVariants } from "@/components/ui/button";
import { PersonStandingIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <>
      <h1 className='flex gap-2 items-center'>
        <PersonStandingIcon size={50} className='text-pink-500' />
        Support Me
      </h1>
      <p className=''>The best dashboard to manage customer support</p>
      <div className='flex gap-2 items-center'>
        <Link
          className={buttonVariants({ variant: "default" })}
          href='/login'
        >
          Log In
        </Link>
        <small>or</small>
        <Button variant='outline' asChild>
          <Link href='/signup'>Sign Up</Link>
        </Button>
      </div>
    </>
  );
};

export default LandingPage;
