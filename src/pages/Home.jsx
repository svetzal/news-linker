import { useState } from 'react';
import { generateShareableUrl } from '../utils/urlUtils';

function Home() {
  const [url, setUrl] = useState('');
  const [shareableUrl, setShareableUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Function to flash the copied message
  const flashCopiedMessage = () => {
    let flashCount = 0;
    const flashInterval = setInterval(() => {
      setCopied(prev => !prev);
      flashCount++;
      if (flashCount >= 5) {
        clearInterval(flashInterval);
        setCopied(false);
      }
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic URL validation
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      // Add http:// prefix if the URL doesn't have a protocol
      let urlToValidate = url;
      if (!url.match(/^https?:\/\//i)) {
        urlToValidate = 'http://' + url;
      }

      // Try to create a URL object to validate
      new URL(urlToValidate);

      // Generate the shareable URL
      const newShareableUrl = generateShareableUrl(urlToValidate);
      setShareableUrl(newShareableUrl);
      setError('');

      // Automatically copy to clipboard
      try {
        // Check if Clipboard API is available
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(newShareableUrl)
            .then(() => {
              flashCopiedMessage();
            })
            .catch(err => {
              console.error('Failed to copy: ', err);
              // Still show the URL so user can manually copy it
              setCopied(true);
            });
        } else {
          // Fallback for browsers that don't support the Clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = newShareableUrl;

          // Make the textarea out of viewport
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);

          textArea.focus();
          textArea.select();

          const successful = document.execCommand('copy');
          if (!successful) {
            throw new Error('Failed to copy text using execCommand');
          }

          document.body.removeChild(textArea);
          flashCopiedMessage();
        }
      } catch (err) {
        console.error('Failed to copy: ', err);
        // Still show the URL so user can manually copy it
        setCopied(true);
      }
    } catch (err) {
      setError('Please enter a valid URL (including http:// or https://)');
    }
  };

  const copyToClipboard = async () => {
    try {
      // Check if Clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareableUrl);
      } else {
        // Fallback for browsers that don't support the Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = shareableUrl;

        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        if (!successful) {
          throw new Error('Failed to copy text using execCommand');
        }

        document.body.removeChild(textArea);
      }

      flashCopiedMessage();
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Still show the URL so user can manually copy it
      setCopied(true);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a Shareable Link</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Enter a news URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/news/article"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-canadian-red"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-canadian-red text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Generate Link
        </button>
      </form>

      {shareableUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Your Shareable Link:</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-canadian-red hover:text-red-700 focus:outline-none"
            >
              {showDetails ? 'Hide Details' : 'Show Encoded Link'}
            </button>
          </div>
          {showDetails && (
              <div className="mb-3">
                <div className="flex items-center">
                  <input
                      type="text"
                      readOnly
                      value={shareableUrl}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-white text-gray-900 focus:outline-none"
                  />
                  <button
                      onClick={copyToClipboard}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
          )}

          <div className={`mb-3 ${copied ? 'text-green-600' : 'text-gray-600'} font-bold text-lg`}>
            Link has been copied to your clipboard!
          </div>

          <p className="text-sm text-gray-600">
            The link is now on your clipboard, you can close this page and paste it on your social media.
          </p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600 text-left">
        <h3 className="font-medium mb-2">How it works:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Paste the URL of a news article you want to share into the input field above</li>
          <li>Click "Generate Link" to create a shareable link (automatically copied to your clipboard)</li>
          <li>Click "Show Details" if you want to see the actual link</li>
          <li>Paste the link and share it on social media</li>
          <li>When someone clicks the link, they'll be briefly brought here, and then redirected to the original news article you provided.</li>
        </ol>
      </div>
    </div>
  );
}

export default Home;
