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
      {/* D20 Icosahedron outer outline only */}
      {/* Top point */}
      <path d="M12 2 L20 7 L18 14 L12 18 L6 14 L4 7 Z" />
      {/* Bottom point */}
      <path d="M12 18 L18 14 L20 17 L12 22 L4 17 L6 14 Z" />
      {/* Left and right edges */}
      <path d="M4 7 L6 14" />
      <path d="M20 7 L18 14" />
      <path d="M6 14 L4 17" />
      <path d="M18 14 L20 17" />
    </svg>
  );
};
