"use client";

import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import Link from "next/link";

interface MagneticButtonProps {
  children: React.ReactNode;
  to?: string;
  className?: string;
  onClick?: () => void;
  magneticStrength?: number;
}

export function MagneticButton({ 
  children, 
  to, 
  className = '', 
  onClick,
  magneticStrength = 0.3 
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setPosition({ x: x * magneticStrength, y: y * magneticStrength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const buttonContent = (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (to) {
    return <Link href={to}>{buttonContent}</Link>;
  }

  return buttonContent;
}
