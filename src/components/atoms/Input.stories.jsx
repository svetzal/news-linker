import Input from './Input';

export default {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export const Default = {
  args: {
    id: 'default-input',
    label: 'Input Label',
    placeholder: 'Enter text here',
    value: '',
  },
};

export const WithValue = {
  args: {
    id: 'value-input',
    label: 'Input with Value',
    value: 'This is a value',
  },
};

export const WithError = {
  args: {
    id: 'error-input',
    label: 'Input with Error',
    value: 'Invalid value',
    error: 'This field has an error',
  },
};

export const Required = {
  args: {
    id: 'required-input',
    label: 'Required Input',
    required: true,
    placeholder: 'This field is required',
  },
};

export const Disabled = {
  args: {
    id: 'disabled-input',
    label: 'Disabled Input',
    value: 'You cannot change this',
    disabled: true,
  },
};

export const WithoutLabel = {
  args: {
    id: 'no-label-input',
    placeholder: 'Input without label',
  },
};

export const URLInput = {
  args: {
    id: 'url-input',
    label: 'Enter URL',
    type: 'url',
    placeholder: 'https://example.com',
  },
};