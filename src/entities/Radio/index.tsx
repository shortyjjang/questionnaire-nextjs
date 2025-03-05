import React, { forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  checked?: boolean;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, checked, ...props }, ref) => {
    const id = useId();
    return (
      <label htmlFor={id} className="flex items-center gap-2">
        <span
          className={twMerge(
            "relative border-2 border-gray-300 rounded-full w-4 h-4 bg-white",
            checked && "border-blue-500"
          )}
        >
          <span
            className={twMerge(
              "absolute inset-0 rounded-full bg-white scale-0 transition-transform will-change-transform",
              checked && "bg-blue-500 border-2 border-white scale-100"
            )}
          />
          <input
            type="radio"
            className="absolute left-0 top-0 opacity-0"
            ref={ref}
            id={id}
            aria-label={label}
            checked={checked}
            {...props}
          />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
