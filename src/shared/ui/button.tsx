import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "text-white border border-[2px] border-[#37334D] bg-gradient-to-b from-[#322e4d] to-[#130f21] rounded-full hover:bg-gradient-to-b hover:from-[#2f2d45] hover:to-[#150f26] cursor-pointer hover:scale-105 active:scale-95",
        destructive:
          "text-white border border-[2px] border-red-600/50 bg-gradient-to-b from-red-600/80 to-red-800/80 rounded-full hover:bg-gradient-to-b hover:from-red-600 hover:to-red-800 cursor-pointer hover:scale-105 active:scale-95",
      },
      size: {
        default: "text-[26px] font-light px-4 py-2",
        sm: "text-sm font-light px-4 py-1.5",
        lg: "text-xl font-light px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
