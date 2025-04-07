import URLInputForm from './URLInputForm';

export default {
  title: 'Molecules/URLInputForm',
  component: URLInputForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onUrlChange: { action: 'URL changed' },
    onSubmit: { action: 'form submitted' },
  },
};

export const Default = {
  args: {
    url: '',
    submitLabel: 'Generate Link',
    placeholder: 'https://example.com/news/article',
  },
};

export const WithValue = {
  args: {
    url: 'https://example.com/news/article',
    submitLabel: 'Generate Link',
  },
};

export const WithError = {
  args: {
    url: 'invalid-url',
    error: 'Please enter a valid URL (including http:// or https://)',
    submitLabel: 'Generate Link',
  },
};

export const Submitting = {
  args: {
    url: 'https://example.com/news/article',
    isSubmitting: true,
    submitLabel: 'Generating...',
  },
};