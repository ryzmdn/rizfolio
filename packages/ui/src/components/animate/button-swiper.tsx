import { ArrowRight } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

interface IGetStartedButtonProps {
  text: string;
  className?: string;
}

export default function ButtonSwiper({
  text = "Get started",
  className,
}: IGetStartedButtonProps) {
  return (
    <div className="min-h-12 w-48">
      <button
        type="button"
        className={cn(
          "group/start flex h-11.5 w-max items-center justify-center gap-3 rounded-full bg-foreground p-1.5 font-medium transition-colors duration-200 ease-in-out hover:bg-muted",
          className,
        )}
      >
        <span
          className={cn(
            "text-secondary pl-2 transition-colors duration-100 ease-in-out group-hover/start:text-accent-foreground",
          )}
        >
          {text}
        </span>
        <div
          className={cn(
            "relative flex size-9 items-center justify-center overflow-hidden rounded-full transition-transform duration-100",
            "bg-background group-hover/start:bg-muted-foreground",
          )}
        >
          <div className="absolute left-1.5 flex h-7 w-14 -translate-x-1/2 items-center justify-center transition-transform duration-200 ease-in-out group-hover/start:translate-x-0">
            <ArrowRight
              className={cn(
                "size-6 transform p-1 text-accent-foreground opacity-0 group-hover/start:opacity-100",
              )}
            />
            <ArrowRight
              className={cn(
                "size-6 transform p-1 text-amber-100 opacity-100 transition-transform duration-300 ease-in-out group-hover/start:opacity-0",
              )}
            />
          </div>
        </div>
      </button>
    </div>
  );
}
