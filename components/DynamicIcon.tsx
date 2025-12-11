import React from 'react';
import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, size = 24, ...props }) => {
  // Check if it's an image URL or Base64 string
  const isImage = name.startsWith('http') || name.startsWith('data:image');

  if (isImage) {
    return (
      <img 
        src={name} 
        alt="icon" 
        style={{ width: size, height: size, objectFit: 'contain' }} 
        className={props.className}
      />
    );
  }

  // Access the icon from the Icons object using the name key
  const IconComponent = (Icons as any)[name];

  // Fallback to HelpCircle if the icon name is invalid or not found
  if (!IconComponent) {
    return <Icons.HelpCircle size={size} {...props} />;
  }

  return <IconComponent size={size} {...props} />;
};

export default DynamicIcon;