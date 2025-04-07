import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { decodeUrl } from '../utils/urlUtils';

function Redirect() {
  const { encodedUrl } = useParams();
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (encodedUrl) {
        const decoded = decodeUrl(encodedUrl);

        // Validate the decoded URL
        try {
          // Add http:// prefix if the URL doesn't have a protocol
          let urlToValidate = decoded;
          if (!decoded.match(/^https?:\/\//i)) {
            urlToValidate = 'http://' + decoded;
          }

          new URL(urlToValidate);
          setOriginalUrl(urlToValidate);
        } catch (err) {
          setError('The link appears to be invalid or corrupted.');
        }
      } else {
        setError('No URL parameter found in the link.');
      }
    } catch (err) {
      setError('Unable to decode the URL. The link may be corrupted.');
      console.error('Decoding error:', err);
    } finally {
      setLoading(false);
    }
  }, [encodedUrl]);

  // Auto-redirect after a short delay (optional)
  useEffect(() => {
    let redirectTimer;
    if (originalUrl && !error) {
      redirectTimer = setTimeout(() => {
        window.location.href = originalUrl;
      }, 5000); // 5 second delay
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [originalUrl, error]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
        <p className="mb-4">{error}</p>
        <Link 
          to="/" 
          className="inline-block bg-canadian-red text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">You're being redirected</h2>

      <div className="mb-6">
        <p className="mb-4">
          You're about to visit:
        </p>
        <div className="p-3 bg-gray-50 rounded-md break-all">
          <a 
            href={originalUrl} 
            className="text-blue-600 hover:underline"
            rel="noopener noreferrer"
          >
            {originalUrl}
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a 
          href={originalUrl} 
          className="flex-1 bg-canadian-red text-white py-2 px-4 rounded-md text-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Continue to Article
        </a>
        <Link 
          to="/" 
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Go Back Home
        </Link>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        You will be automatically redirected in 5 seconds.
      </p>
    </div>
  );
}

export default Redirect;
