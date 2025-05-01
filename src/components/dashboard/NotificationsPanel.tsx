import React from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const NotificationsPanel: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>
      <ul className="space-y-2">
        <li className="bg-gray-100 p-2 rounded">No new notifications</li>
      </ul>
    </div>
  );
};

export default NotificationsPanel;