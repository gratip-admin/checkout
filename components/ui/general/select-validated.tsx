"use client";
import clsx from "clsx";
import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { ChevronUpIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useField } from "formik";
// import InputSelect from "./input-select-main";

export default function SelectValidated({
  placeholder,
  options,
  className,
  menuClassName,
  hasTag,
  h,
  name,
  callOnChange,
  preloadValues,
  position,
}: {
  placeholder?: string;
  options: any[];
  className?: string;
  menuClassName?: string;
  hasTag?: boolean;
  h?: string;
  name: string;
  preloadValues?: boolean;
  callOnChange?: () => void;
  position?: "top" | "bottom";
}) {
  const [field, meta, { setValue }] = useField(name);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useEffect(() => {
    const checkDropdownPosition = () => {
      if (!triggerRef.current || !dropdownRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Estimate dropdown height (40px per option + some padding)
      const estimatedDropdownHeight = options.length * 40 + 20;

      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      // Determine best position
      if (
        spaceBelow < estimatedDropdownHeight &&
        spaceAbove > estimatedDropdownHeight
      ) {
        setDropdownPosition("top");
        console.log("top");
      } else {
        setDropdownPosition("bottom");
        console.log("bottom");
      }
    };

    if (isOpen) {
      checkDropdownPosition();
      window.addEventListener("resize", checkDropdownPosition);

      // Close dropdown if clicked outside
      const handleClickOutside = (event: any) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("resize", checkDropdownPosition);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, options]);

  useEffect(() => {
    if (preloadValues && field.value) {
      if (field.value.startsWith("Option ")) {
        const index = Number(field.value.split(" ")[1]) - 1 || 0;
        if (index >= 0 && index < options.length) {
          setValue(options[index].name ?? options[index].value);
        }
      } else {
        setValue(field.value);
      }
    }
  }, [preloadValues, setValue, field.value, options]);

  // Filtered options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(
      (option) =>
        (option.name &&
          option.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (option.value &&
          option.value.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (field?.value) {
      if (callOnChange && typeof callOnChange === "function") {
        callOnChange();
      }
    }
  }, [field?.value]);

  return (
    <div className="">
      <div
        tabIndex={1}
        ref={triggerRef}
        className={`relative ${h ? h : "h-12"}`}
      >
        <div
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={clsx(
            `input-focus text-[.9rem] ${
              placeholder && field?.value === placeholder
                ? "text-[#9A9EA2]"
                : " text-[#1A1B1C]"
            }   ${h ? h : "h-12"}    ${
              meta.error && meta.touched
                ? "!border-[#DC2626]"
                : "border-[#BCBEC1]"
            } cursor-pointer font-satoshi z-[1]  rounded-full flex items-center px-0`,
            className
          )}
        >
          {field?.value ? (
            <div
              className={` ${
                false ? "text-[#9A9EA2] !font-normal" : "text-[#1A1B1C]"
              } font-satoshi cursor-pointer text-[.9rem] flex items-center justify-between`}
            >
              <div className="flex h-8 items-center gap-[.25rem]">
                {options?.find(
                  (item) =>
                    item?.name === field?.value || item?.value === field?.value
                )?.icon ? (
                  <div className="h-4 w-4 object-contain relative">
                    <Image
                      src={
                        options?.find(
                          (item) =>
                            item?.name === field?.value ||
                            item?.value === field?.value
                        )?.icon
                      }
                      alt={
                        options?.find(
                          (item) =>
                            item?.name === field?.value ||
                            item?.value === field?.value
                        )?.name
                      }
                      layout="fill"
                      objectFit="contain"
                      objectPosition="center"
                    />
                  </div>
                ) : null}
                <span
                  className={`font-satoshi ${
                    false
                      ? "text-[#9A9EA2] font-normal"
                      : "text-[#1A1B1C] font-medium"
                  } mb-[0rem] leading-0`}
                >
                  {" "}
                  {
                    options?.find(
                      (item) =>
                        item?.name === field?.value ||
                        item?.value === field?.value
                    )?.name
                  }
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[#9A9EA2] font-normal text-[.9rem]">
              {placeholder}
            </p>
          )}
          <ChevronUpIcon
            className={clsx(
              "w-5 h-5 absolute right-0 top-[9px] text-[DDDDDD] transition-transform duration-300",
              isOpen ? "rotate-0" : "rotate-180"
            )}
          />
        </div>
        {isOpen && (
          <div
            ref={dropdownRef}
            className={`bg-[white] border border-[#dddddd88] absolute  w-full  ${
              position === "top"
                ? " bottom-0 mb-[60px]"
                : "top-[100%] mt-[10px]"
            }  z-[10] p-4 rounded-lg shadow-md   `}
          >
            {options?.length > 5 && (
              <div className="py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-[#DDDDDD] h-10 rounded-full p-2 text-[.92rem] text-[#1A1B1C]"
                />
              </div>
            )}
            <div className=" max-h-[8rem] overflow-y-auto scrollbar-thin">
              {[...filteredOptions]?.map((option: any, index: number) => (
                <div
                  onClick={() => {
                    setValue(option?.value ?? option?.name);
                    setIsOpen(false);
                  }}
                  key={index}
                  className={` ${
                    placeholder && option?.name === placeholder
                      ? "text-[#9A9EA2] !font-normal"
                      : "text-[#1A1B1C]"
                  } font-satoshi cursor-pointer text-[.9rem] flex items-center justify-between`}
                >
                  <div className="flex h-8 items-center gap-[.25rem]">
                    {option?.icon ? (
                      <div className="h-4 w-4 object-contain relative">
                        <Image
                          src={option?.icon}
                          alt={option?.name}
                          layout="fill"
                          objectFit="contain"
                          objectPosition="center"
                        />
                      </div>
                    ) : null}
                    <span
                      className={`font-satoshi ${
                        placeholder && option?.name === placeholder
                          ? "text-[#9A9EA2] font-normal"
                          : "text-[#1A1B1C] font-medium"
                      } mb-[0rem] leading-0`}
                    >
                      {" "}
                      {option?.name}
                    </span>
                  </div>

                  <p>
                    {(field?.value === option?.value ||
                      field?.value === option?.name) && (
                      <CheckIcon className="size-4 text-[#007BFF]" />
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {meta.error && meta.touched && (
        <p className="text-xs text-[#DC2626] font-[500]">Required</p>
      )}
    </div>
  );
}
