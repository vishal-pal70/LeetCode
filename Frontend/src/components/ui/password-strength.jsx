// components/ui/password-strength.jsx
import React from 'react';

export const PasswordStrengthIndicator = ({ strength }) => {
  const getStrengthText = () => {
    switch (strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-700';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span>Password strength:</span>
        <span className={`font-medium ${
          strength === 0 ? 'text-red-500' : 
          strength === 1 ? 'text-orange-500' : 
          strength === 2 ? 'text-yellow-500' : 
          strength === 3 ? 'text-green-500' : 
          'text-green-700'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="flex h-1.5 w-full space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div 
            key={level} 
            className={`flex-1 rounded-full ${
              strength >= level ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};