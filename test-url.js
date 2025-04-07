import { encodeUrl, decodeUrl } from './src/utils/urlUtils.js';

// The problematic URL from the issue description
const originalUrl = 'https://www.cbc.ca/news/canada/manitoba/canada-us-tariffs-north-south-dakota-farmers-1.7502342';
const encodedUrl = 'IZZHL%2B__VVV-EWE-EQ_FTVL_EQFQRQ_DQFOZGWQ_EQFQRQ!XL!ZQKOYYL!FGKZI!LGXZI!RQAGZQ!YQKDTKL!6-2057897';

// Test decoding the provided encoded URL
console.log('Original URL:', originalUrl);
console.log('Encoded URL:', encodedUrl);

const decodedUrl = decodeUrl(encodedUrl);
console.log('Decoded URL:', decodedUrl);
console.log('Decoded URL matches original URL:', decodedUrl === originalUrl);

// Test encoding and then decoding the original URL
const newEncodedUrl = encodeUrl(originalUrl);
console.log('Newly encoded URL:', newEncodedUrl);

const newDecodedUrl = decodeUrl(newEncodedUrl);
console.log('Newly decoded URL:', newDecodedUrl);
console.log('Newly decoded URL matches original URL:', newDecodedUrl === originalUrl);