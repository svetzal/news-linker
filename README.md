# News Linker

A free service that allows users to share news links on social media platforms that may otherwise block or restrict news content.

## Background

In Canada, Facebook has restricted the ability to share news stories. This application provides a workaround by allowing users to create derivative URLs that can be posted on social media. When someone clicks the link, they land on this application, which then redirects them to the original news article.

## Features

- Enter any news URL and generate a shareable link
- Custom URL encoding that obfuscates the original URL
- No backend services required - works entirely in the browser
- Material design with subtle Canadian flag colors
- Responsive design that works on all devices

## How It Works

1. A user enters a news URL on the home page
2. The application encodes the URL using a custom algorithm (not Base64)
3. A new URL is generated that points back to this application with the encoded URL as a parameter
4. When someone visits the generated URL, the application decodes the original URL and provides a link to it

## Technology Stack

- React for the UI
- Vite for the build system
- TailwindCSS for styling
- React Router for navigation
- Storybook with Atomic Design principles for component development

## Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd news-linker

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

This will start the development server at http://localhost:5173.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Storybook

```bash
npm run storybook
```

This will start Storybook at http://localhost:6006.

### Running Tests

```bash
npm test
```

Note: This project uses ES modules, which require the `--experimental-vm-modules` flag when running Jest tests. The test script in package.json has been configured to use this flag automatically.

## Deployment

The application can be deployed to any static hosting service, such as:

- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

No server-side code or database is required.

### AWS S3 + CloudFront Deployment

This project includes a CloudFormation template and deployment script for easy deployment to AWS S3 and CloudFront:

1. Make sure you have the [AWS CLI](https://aws.amazon.com/cli/) installed and configured with appropriate credentials
2. Optionally, register a domain and create an SSL certificate in AWS Certificate Manager
3. Run the deployment script:

```bash
# Using the deployment script directly
# Deploy with default settings
./deploy.sh

# Deploy with custom domain
./deploy.sh your-domain.com

# Deploy with custom domain and SSL certificate
./deploy.sh your-domain.com arn:aws:acm:us-east-1:123456789012:certificate/abcdef-1234-5678-abcd-123456789012

# Using npm scripts
# Deploy with default settings
npm run deploy

# Deploy with custom domain
npm run deploy:domain your-domain.com
```

The deployment script will:
- Build the application
- Create or update the CloudFormation stack
- Upload the built files to S3
- Invalidate the CloudFront cache

After deployment, the script will output the website URL. If you're using a custom domain, you'll need to set up DNS records to point to the CloudFront distribution.

## License

This project is open source and available under the [MIT License](LICENSE).
