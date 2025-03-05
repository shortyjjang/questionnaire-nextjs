import React, { forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  checked?: boolean;
}
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, ...props }, ref) => {
    const id = useId();
    return (
      <label htmlFor={id} className="flex items-center gap-2">
        <span
          className={twMerge(
            "relative border-2 border-gray-300 rounded-sm w-4 h-4 bg-white",
            checked && "border-blue-500 bg-blue-500"
          )}
        >
          <span
            className={twMerge(
              "absolute top-[9px] left-1 scale-0 transition-transform will-change-transform -rotate-45",
              checked && "scale-100"
            )}
          >
            <span className="w-3 h-[2px] bg-white block absolute left-0 bottom-0" />
            <span className="w-[2px] h-[6px] bg-white block absolute left-0 bottom-0" />
          </span>
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
