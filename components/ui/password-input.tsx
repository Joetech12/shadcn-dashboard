"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface passwordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, passwordInputProps>(
  ({ className, type, ...props }, ref) => {
    const [showpassword, setShowPassword] = React.useState(false);
    return (
      <div className='relative '>
        <Input
          type={showpassword ? "text" : "password"}
          {...props}
          ref={ref}
          className={cn("pr-10", className)}
        />
        <span
          className='absolute top-[7px] right-1 cursor-pointer select-none'
          onClick={() => setShowPassword(!showpassword)}
        >
          {showpassword ? <EyeIcon /> : <EyeOffIcon />}
        </span>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
