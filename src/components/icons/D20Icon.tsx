import { SVGProps } from "react";

export const D20Icon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Icosahedron outline */}
      {/* Top pyramid */}
      <path d="M12 2 L20 8 L16 14 L12 8 L8 14 L4 8 Z" />
      {/* Middle band */}
      <path d="M4 8 L8 14 L12 8 L16 14 L20 8" />
      {/* Bottom pyramid */}
      <path d="M4 8 L8 14 L12 22 L16 14 L20 8" />
      <path d="M8 14 L12 22 L16 14" />
      {/* Connecting lines */}
      <path d="M12 2 L12 8" />
      <path d="M12 8 L12 22" />
    </svg>
  );
};
