import { SVGProps } from "react";

export const D20Icon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* D20 Icosahedron with filled faces */}
      
      {/* Filled triangular faces for depth */}
      <path d="M 50,15 L 75,35 L 50,50 Z" fill="currentColor" opacity="0.2" />
      <path d="M 50,50 L 75,65 L 50,85 Z" fill="currentColor" opacity="0.15" />
      <path d="M 25,65 L 50,85 L 50,50 Z" fill="currentColor" opacity="0.1" />
      
      {/* Outer hexagonal frame */}
      <path d="M 50,15 L 85,30 L 85,70 L 50,85 L 15,70 L 15,30 Z" />
      
      {/* Internal triangular connections */}
      <path d="M 50,15 L 15,30" />
      <path d="M 50,15 L 50,50" />
      <path d="M 50,15 L 85,30" />
      <path d="M 15,30 L 25,65" />
      <path d="M 25,65 L 15,70" />
      <path d="M 25,65 L 50,50" />
      <path d="M 50,50 L 75,35" />
      <path d="M 75,35 L 85,30" />
      <path d="M 75,35 L 75,65" />
      <path d="M 75,65 L 85,70" />
      <path d="M 75,65 L 50,50" />
      <path d="M 50,85 L 50,50" />
    </svg>
  );
};
