import React from 'react';

const kindStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const Notification = ({ type = 'info', title, message, onClose }) => {
  return (
    <div className={`card border ${kindStyles[type] || kindStyles.info} p-4`}> 
      <div className="flex items-start justify-between">
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        <div>
          <button onClick={onClose} className="text-sm font-medium text-gray-600 px-2 py-1">✕</button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
