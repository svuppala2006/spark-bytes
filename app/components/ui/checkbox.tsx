// app/components/ui/checkbox.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    className={cn(
      "h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600",
      className
    )}
    ref={ref}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

export { Checkbox };