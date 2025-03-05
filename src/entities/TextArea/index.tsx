
import React, { forwardRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'small' | 'medium' | 'large'
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  value?: string
  className?: string
  placeholder?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ onFocus, onBlur, size = 'medium', value, className, placeholder, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <span className={twMerge("relative flex items-center focus-within:border-b focus-within:border-gray-300 bg-white w-fit",
        size === "small" && "text-sm py-1",
        size === "medium" && "text-base py-2",
        size === "large" && "text-lg py-3",
        className
      )}
    >
      <span
        className={twMerge(
          "absolute -bottom-px left-0 w-full h-[2px] scale-x-0 bg-blue-500 transition-transform will-change-transform",
          isFocused && "scale-x-100"
        )}
      ></span>
      <span className='opacity-0 whitespace-pre-wrap block'>
        {value || placeholder}
      </span>
      <textarea
        ref={ref}
        {...props}
        value={value || placeholder}
        onFocus={(e) => {
          setIsFocused(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        className={twMerge(
          "absolute inset-0 w-full h-full outline-none resize-none overflow-hidden",
          size === "small" && "text-sm py-1",
          size === "medium" && "text-base py-2",
          size === "large" && "text-lg py-3",
          value ? "text-black" : "text-gray-500"
        )}
      />
    </span>
  )
})

TextArea.displayName = 'TextArea'

export default TextArea
