import React from 'react';
import { Switch } from './Switch';

interface BotStatusToggleProps {
  label: string;
  isActive: boolean;
  onChange: (value: boolean) => void;
}

export const BotStatusToggle: React.FC<BotStatusToggleProps> = ({ label, isActive, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
      <span className="text-white">{label}</span>
      <Switch checked={isActive} onChange={onChange} />
    </div>
  );
};