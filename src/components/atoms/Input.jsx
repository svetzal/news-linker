import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input component for text entry
 */
const Input = ({
  id,
  type = 'text',
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error = '',
  required = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2';
  const stateClasses = error
    ? 'border-red-300 focus:border-red-300 focus:ring-red-200'
    : 'border-gray-300 focus:border-canadian-red focus:ring-canadian-red/20';
  const disabledClass = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  
  const inputClasses = `${baseClasses} ${stateClasses} ${disabledClass} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-canadian-red ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  /**
   * Input ID (required for accessibility)
   */
  id: PropTypes.string.isRequired,
  /**
   * Input type
   */
  type: PropTypes.string,
  /**
   * Input label
   */
  label: PropTypes.string,
  /**
   * Input value
   */
  value: PropTypes.string,
  /**
   * Input change handler
   */
  onChange: PropTypes.func,
  /**
   * Input placeholder
   */
  placeholder: PropTypes.string,
  /**
   * Is the input disabled?
   */
  disabled: PropTypes.bool,
  /**
   * Error message
   */
  error: PropTypes.string,
  /**
   * Is the input required?
   */
  required: PropTypes.bool,
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default Input;