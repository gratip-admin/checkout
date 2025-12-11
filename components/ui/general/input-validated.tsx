"use client";
import clsx from "clsx";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import {
  useField,
  FieldInputProps,
  FieldMetaProps,
  FieldHelperProps,
} from "formik";
import React, { InputHTMLAttributes, useEffect } from "react";

// Create a proper interface for the component props
interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  name: string; // Make name required
  className?: string; // Make className optional
  value?: string | undefined;
  Icon?: React.ElementType;
}

export default function Input({
  className,
  value,
  Icon,
  ...props
}: InputProps) {
  // Properly type the useField hook
  const [field, meta, helpers]: [
    FieldInputProps<string>,
    FieldMetaProps<string>,
    FieldHelperProps<string>
  ] = useField(props.name);

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    // e?.target?.blur();
  };

  useEffect(() => {
    if (value) {
      helpers?.setValue(value || "");
    }
  }, [value, helpers]);

  return (
    <div>
      <div
        className={clsx(
          `w-full input-focus flex items-center gap-2 font-[400] border-b
            ${
              meta.error && meta.touched
                ? "!border-[#DC2626]"
                : "border-[#BCBEC1]"
            } w-full h-10 placeholder-[#9A9EA2] text-[#1A1B1C]`,
          className
        )}
      >
        {Icon && <Icon className="size-5 mt-[1px] text-[#9A9EA2]" />}
        <input
          {...props}
          {...field}
          value={field.value || value || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            helpers.setValue(e.target.value)
          }
          onWheel={handleWheel}
          min="0"
          step="any"
          className={clsx(
            ` font-[400] w-full h-10 text-[.9rem] placeholder-[#9A9EA2] text-[#1A1B1C]`,
            className
          )}
        />
      </div>
      {meta.error && meta.touched && (
        <p className="text-xs text-[#DC2626] font-[500]">
          {meta.error}
          {/* Required */}
        </p>
      )}
    </div>
  );
}
