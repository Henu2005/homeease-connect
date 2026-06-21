import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends Omit<React.ComponentProps<'svg'>, 'ref'> {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 20, ...props }) => {
  // Gracefully fallback to Home if icon name doesn't exist
  const LucideIcon = (LucideIcons as any)[name] || LucideIcons.Home;
  return <LucideIcon className={className} size={size} {...props} />;
};
