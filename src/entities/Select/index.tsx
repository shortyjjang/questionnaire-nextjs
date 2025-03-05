
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options?: Option[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Select({
  options: defaultOptions = [],
  placeholder = "선택하기",
  value,
  onChange,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([
    {
      label: placeholder,
      value: "",
    },
    ...defaultOptions,
  ]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (isOpen && selectedOption) {
      const selectedIndex = options.findIndex(
        (option) => option.value === value
      );
      setHighlightedIndex(selectedIndex);
      scrollToHighlighted(selectedIndex);
    }
  }, [isOpen, options, selectedOption, value]);
  useEffect(() => {
    setOptions([
      {
        label: placeholder,
        value: "",
      },
      ...defaultOptions,
    ]);
  }, [defaultOptions, placeholder]);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen && highlightedIndex !== -1) {
        handleSelect(options[highlightedIndex]);
      } else {
        toggleDropdown();
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) return setIsOpen(true);

      setHighlightedIndex((prev) => {
        const nextIndex = e.key === "ArrowDown" ? prev + 1 : prev - 1;
        const clampedIndex = Math.max(
          0,
          Math.min(nextIndex, options.length - 1)
        );
        scrollToHighlighted(clampedIndex);
        return clampedIndex;
      });
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };
  const scrollToHighlighted = (index: number) => {
    if (listRef.current) {
      const items = listRef.current.children;
      if (items[index] && typeof listRef.current.scrollTo === "function") {
        listRef.current.scrollTo({
          top: items[index].getBoundingClientRect().top - listRef.current.getBoundingClientRect().top - 120,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div
      className={twMerge("relative w-fit", isOpen && "z-10", className)}
      ref={selectRef}
      tabIndex={0}
      aria-expanded={isOpen}
      onKeyDown={handleKeyDown}
    >
      <div
        className="flex items-center relative justify-between px-4 py-2 border border-gray-300 rounded cursor-pointer bg-white"
        onClick={toggleDropdown}
      >
        <span className="pr-4">{selectedOption ? selectedOption.label : placeholder}</span>
        <span
          className={twMerge(
            "absolute right-4 top-1/2 -translate-y-1/2 border-transparent border-t-black border-4 rotate-180",
            isOpen ? "rotate-180 -mt-px" : "rotate-0 mt-1"
          )}
        ></span>
      </div>
      {isOpen && options.length > 0 && (
        <ul
          ref={listRef}
          className="absolute whitespace-nowrap mt-1 w-fit max-h-[300px] overflow-y-auto border border-gray-300 rounded bg-white shadow-lg"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`pl-4 py-2 cursor-pointer text-gray-800 pr-8 ${
                highlightedIndex === index ? "bg-gray-200" : ""
              } ${value === option.value ? "bg-blue-50 text-black" : ""}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
