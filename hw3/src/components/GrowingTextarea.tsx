"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type GrowingTextareaProps = {
  wrapperClassName?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled: boolean;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const GrowingTextarea = forwardRef<HTMLTextAreaElement, GrowingTextareaProps>(
  ({ className, wrapperClassName, placeholder, value, onChange, disabled }, ref) => {
    return (
      <div
        className={cn(
          wrapperClassName,
          "grid",
          "after:invisible after:whitespace-pre after:content-[attr(data-replicated-value)]",
          "after:col-span-1 after:col-start-1 after:row-span-1 after:row-start-1",
        )}
      >
        <textarea
          className={cn(
            className,
            "resize-none overflow-hidden",
            "col-span-1 col-start-1 row-span-1 row-start-1",
          )}
          placeholder={placeholder}
          value={value}
          onInput={(e) => {
            const target = e.target;
            if (!(target instanceof HTMLTextAreaElement)) return;
            const parent = target.parentElement!;
            parent.dataset.replicatedValue = target.value + " ";
          }}
          onChange={(e) => onChange?.(e.target.value)}
          ref={ref}
          disabled={disabled}
        ></textarea>
      </div>
    );
  },
);

GrowingTextarea.displayName = "GrowingTextarea";

export default GrowingTextarea;
