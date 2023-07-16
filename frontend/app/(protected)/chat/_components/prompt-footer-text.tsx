import React from "react";

import { cn } from "@/lib/utils";

export function PromptFooterText({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className
      )}
      {...props}
    >
      Powered by <b>@timmorehousefencingclub</b>
    </p>
  );
}
