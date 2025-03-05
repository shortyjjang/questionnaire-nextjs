import React, { forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  checked?: boolean;
}
const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, checked, ...props }, ref) => {
    const id = useId();
    return (
      <label htmlFor={id} className="flex items-center gap-2 pl-1">
        <span
          className={twMerge(
            "relative w-10 h-4 rounded-s-full rounded-e-full bg-gray-200 cursor-pointer",
            checked && "bg-blue-100"
          )}
        >
          <span
            className={twMerge(
              "absolute top-0 left-0 w-6 h-6 -ml-1 -mt-1 bg-white rounded-full shadow-lg transition-transform will-change-transform translate-x-0",
              checked && "translate-x-5 bg-blue-500"
            )}
          />
          <input
            type="checkbox"
            className="absolute left-0 top-0 opacity-0"
            ref={ref}
            id={id}
            checked={checked}
            {...props}
          />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
