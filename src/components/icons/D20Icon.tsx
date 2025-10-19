import { SVGProps } from "react";

export const D20Icon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* D20 Icosahedron - geometric outline */}
      {/* Outer pentagon */}
      <path d="M 50,8 L 82,28 L 73,62 L 27,62 L 18,28 Z" />
      
      {/* Bottom pentagon */}
      <path d="M 27,62 L 50,92 L 73,62" />
      <path d="M 18,28 L 8,50 L 27,62" />
      <path d="M 82,28 L 92,50 L 73,62" />
      <path d="M 8,50 L 50,92 L 92,50" />
      
      {/* Inner triangle connections */}
      <path d="M 50,8 L 27,62" />
      <path d="M 50,8 L 73,62" />
      <path d="M 18,28 L 73,62" />
      <path d="M 82,28 L 27,62" />
      <path d="M 50,8 L 8,50" />
      <path d="M 50,8 L 92,50" />
    </svg>
  );
};
