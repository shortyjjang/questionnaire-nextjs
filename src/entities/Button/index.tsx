import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "default" | "danger";
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "default", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={twMerge(
          "px-4 py-2 rounded-md cursor-pointer",
          className,
          variant === "primary"
            ? "bg-blue-500 text-white"
            : variant === "danger"
            ? "border border-red-500 text-red-500"
            : "border border-gray-300 text-black"
        )}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
