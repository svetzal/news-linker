import { encodeUrl, decodeUrl, generateShareableUrl } from '../urlUtils.js';

describe('URL Encoding and Decoding', () => {
  test('should correctly encode and decode a simple URL', () => {
    const originalUrl = 'https://example.com/path/to/resource?param=value';
    const encodedUrl = encodeUrl(originalUrl);
    const decodedUrl = decodeUrl(encodedUrl);
    expect(decodedUrl).toBe(originalUrl);
  });

  test('should handle the problematic CBC URL correctly', () => {
    const originalUrl = 'https://www.cbc.ca/news/canada/manitoba/canada-us-tariffs-north-south-dakota-farmers-1.7502342';
    const encodedUrl = 'IZZHL%2B__VVV-EWE-EQ_FTVL_EQFQRQ_DQFOZGWQ_EQFQRQ!XL!ZQKOYYL!FGKZI!LGXZI!RQAGZQ!YQKDTKL!6-2057897';

    // Test decoding the provided encoded URL
    const decodedUrl = decodeUrl(encodedUrl);
    expect(decodedUrl).toBe(originalUrl);

    // Test encoding the original URL
    const newEncodedUrl = encodeUrl(originalUrl);
    const newDecodedUrl = decodeUrl(newEncodedUrl);
    expect(newDecodedUrl).toBe(originalUrl);
  });

  // Data-driven roundtrip tests for various URL patterns
  const sampleUrls = [
    // Numeric IDs
    'https://example.com/article/12345',
    'https://news.site/story/987654321',
    'https://blog.example.org/posts/2023/05/article-123456',
    'https://api.example.com/v1/users/42/posts/789',
    // Query parameters
    'https://example.com/search?q=test&page=1&limit=20',
    'https://api.example.com/data?from=2023-01-01&to=2023-12-31&format=json',
    'https://shop.example.com/products?category=electronics&sort=price&order=asc&page=2',
    // Special characters
    'https://example.com/path with spaces/resource',
    'https://example.com/search?q=special+characters&filter=test%20value',
    'https://example.com/path/to/resource?param=value&other=some+thing',
    // Repeated characters
    'https://example.com/path/with/looooooong/segment',
    'https://example.com/search?q=repeated---------dash',
    'https://example.com/path/to/resource?param=11111111111&other=22222222222',
    // Fragments
    'https://example.com/page#section1',
    'https://docs.example.org/guide#introduction',
    'https://example.com/article/12345#comments',
    'https://example.com/search?q=test#results',
    // International characters
    'https://例子.测试/路径',
    'https://example.com/café',
    'https://example.com/search?q=München',
    'https://example.com/products/名称',
    // Very long URLs
    `https://example.com/api?param=${'a'.repeat(500)}`,
    `https://example.com/path/to/resource/${'segment'.repeat(50)}`,
    `https://example.com/${'very-long-path-segment-'.repeat(20)}`,
    // Unusual schemes
    'ftp://ftp.example.org/pub/files/',
    'mailto:user@example.com',
    'tel:+1-234-567-8901',
    'data:text/plain;base64,SGVsbG8gV29ybGQ=',
    // Empty query parameters
    'https://example.com/search?',
    'https://example.com/api?param=',
    'https://example.com/page?filter=&sort=',
    'https://example.com/products?category=electronics&brand=',
    // Multiple consecutive special characters
    'https://example.com/path//with//double//slashes',
    'https://example.com/path/with...dots',
    'https://example.com/search?q=term&&category=books',
    'https://example.com/path/with%20%20multiple%20%20spaces',
    // Edge cases for RLE compression (exactly 4 repeats)
    'https://example.com/aaaa/bbbb',
    'https://example.com/path/with/exactly/4444/digits',
    'https://example.com/search?q=test----dash',
    'https://example.com/resource?id=1111&type=2222'
  ];

  test.each(sampleUrls)('should roundtrip encode/decode for %s', url => {
    expect(decodeUrl(encodeUrl(url))).toBe(url);
  });

  test('generateShareableUrl should create a valid shareable URL', () => {
    // Mock window.location.origin
    const originalOrigin = window.location.origin;
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true
    });

    const originalUrl = 'https://target-site.com/some/path?param=value';
    const shareableUrl = generateShareableUrl(originalUrl);

    // Check that the shareable URL has the correct format
    expect(shareableUrl).toMatch(/^https:\/\/example\.com\/r\/.+$/);

    // Extract the encoded part and verify it decodes correctly
    const encodedPart = shareableUrl.split('/r/')[1];
    const decodedUrl = decodeUrl(encodedPart);
    expect(decodedUrl).toBe(originalUrl);

    // Restore original window.location
    Object.defineProperty(window, 'location', {
      value: { origin: originalOrigin },
      writable: true
    });
  });

  // URLs with unusual port numbers: verify roundtrip and host preservation
  test.each([
    ['https://example.com:8080/path', 'example.com'],
    ['http://localhost:3000/api', 'localhost'],
    ['https://internal.example.org:8443/secure', 'internal.example.org'],
    ['http://192.168.1.1:8888/admin', '192.168.1.1']
  ])('should preserve host for %s', (url, host) => {
    const decoded = decodeUrl(encodeUrl(url));
    expect(decoded).toBe(url);
    expect(decoded.split('/')[2].split(':')[0]).toBe(host);
  });

  // URLs with authentication information: verify roundtrip and domain preservation
  test.each([
    ['https://user:password@example.com', 'example.com'],
    ['http://admin@internal-site.org', 'internal-site.org'],
    ['https://api-key:secret@api.example.com/v2', 'api.example.com'],
    ['ftp://anonymous:guest@ftp.example.org', 'ftp.example.org']
  ])('should preserve domain for %s', (url, domain) => {
    const decoded = decodeUrl(encodeUrl(url));
    expect(decoded).toBe(url);
    expect(decoded.split('@').pop().split('/')[0]).toBe(domain);
  });


  // Decoding invalid encoded URLs should not throw and return a string
  const invalidEncodedUrls = [
    '',
    'INVALID_ENCODED_URL',
    'https://example.com',
    encodeUrl('https://example.com') + 'extra-invalid-chars'
  ];

  test.each(invalidEncodedUrls)('should decode invalid encoded URL "%s" gracefully', invalidUrl => {
    expect(() => decodeUrl(invalidUrl)).not.toThrow();
    expect(typeof decodeUrl(invalidUrl)).toBe('string');
  });

  test('should decode the BBC URL correctly', () => {
    // The decoded URL must be character for character identical to the originalURL
    const originalUrl = 'https://www.bbc.com/news/articles/cvg7pqzk47zo';

    // Test that the URL can be encoded and then decoded back
    const encodedUrl = encodeUrl(originalUrl);
    const decodedUrl = decodeUrl(encodedUrl);

    // The decoded URL must be exactly the same as the original URL
    expect(decodedUrl).toBe(originalUrl);
  });
});
