import * as React from "react";
import { cn } from "@/lib/utils";
import { CornerFlourish } from "./sigils";

interface IllumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  corners?: boolean;
  cornerSize?: number;
  innerBorder?: boolean;
}

export function IllumCard({
  corners = true,
  cornerSize = 30,
  innerBorder = true,
  className,
  children,
  style,
  ...rest
}: IllumCardProps) {
  return (
    <div className={cn("illum p-5", className)} style={style} {...rest}>
      {innerBorder && <span className="illum-inner" aria-hidden />}
      {corners && (
        <>
          <span className="corner-flourish tl" aria-hidden>
            <CornerFlourish size={cornerSize} />
          </span>
          <span className="corner-flourish tr" aria-hidden>
            <CornerFlourish size={cornerSize} />
          </span>
          <span className="corner-flourish bl" aria-hidden>
            <CornerFlourish size={cornerSize} />
          </span>
          <span className="corner-flourish br" aria-hidden>
            <CornerFlourish size={cornerSize} />
          </span>
        </>
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
