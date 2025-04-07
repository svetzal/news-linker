import React from 'react';
import PropTypes from 'prop-types';

/**
 * Primary UI component for user interaction
 */
const Button = ({
  primary = true,
  size = 'medium',
  label,
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };
  
  const colorClasses = primary
    ? 'bg-canadian-red text-white hover:bg-red-700 focus:ring-red-500'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400';
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${colorClasses} ${widthClass} ${disabledClass} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  /**
   * Is the button disabled?
   */
  disabled: PropTypes.bool,
  /**
   * Should the button take up the full width of its container?
   */
  fullWidth: PropTypes.bool,
  /**
   * Button type (button, submit, reset)
   */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default Button;