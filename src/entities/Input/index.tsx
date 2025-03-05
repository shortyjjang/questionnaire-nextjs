
import React, { forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  size?: "small" | "medium" | "large";
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onFocus, onBlur, size = "medium", className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
      <span className={twMerge("relative flex items-center border-b border-transparent hover:border-gray-300 focus-within:border-gray-300 bg-white w-fit", className)}>
        <span
          className={twMerge(
            "absolute -bottom-px left-0 w-full h-[2px] scale-x-0 bg-blue-500 transition-transform will-change-transform",
            isFocused && "scale-x-100"
          )}
        ></span>
        <input
          type="text"
          ref={ref}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          className={twMerge(
            "bg-transparent w-full outline-none border-none",
            size === "small" && "text-sm py-1",
            size === "medium" && "text-base py-2",
            size === "large" && "text-lg py-3"
          )}
        />
      </span>
    );
  }
);

Input.displayName = "Input";

export default Input;
