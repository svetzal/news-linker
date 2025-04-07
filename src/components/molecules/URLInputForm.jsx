import React from 'react';
import PropTypes from 'prop-types';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

/**
 * Form component for URL input and submission
 */
const URLInputForm = ({
  url,
  onUrlChange,
  onSubmit,
  error = '',
  isSubmitting = false,
  submitLabel = 'Submit',
  placeholder = 'https://example.com',
  className = '',
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="mb-4">
        <Input
          id="url-input"
          label="Enter a URL"
          type="text"
          value={url}
          onChange={onUrlChange}
          placeholder={placeholder}
          error={error}
          required
        />
      </div>
      
      <Button
        type="submit"
        label={submitLabel}
        disabled={isSubmitting}
        fullWidth
      />
    </form>
  );
};

URLInputForm.propTypes = {
  /**
   * Current URL value
   */
  url: PropTypes.string.isRequired,
  /**
   * Handler for URL changes
   */
  onUrlChange: PropTypes.func.isRequired,
  /**
   * Form submission handler
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Error message
   */
  error: PropTypes.string,
  /**
   * Is the form currently submitting?
   */
  isSubmitting: PropTypes.bool,
  /**
   * Label for the submit button
   */
  submitLabel: PropTypes.string,
  /**
   * Placeholder for the URL input
   */
  placeholder: PropTypes.string,
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default URLInputForm;