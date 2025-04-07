# News Linker

In Canada, Facebook has restricted the ability to share news stories. This situation was created by the Canadian Government standing up for Canadian Media, however it has resulted in this lash-back which has constrained peoples' ability to share proper news sources, and thus has allowed Canadians to be inundated with fake-news feeds that are not blocked.

This site is a free service that allows a user to paste a URL, and then creates a derivative URL that they can post to social media platforms like Facebook. When a user clicks that link, they land on this app, where they can click through to visit the actual original URL.

## Functional Requirements:
- The home page allows the user to enter a news URL
- The site encodes the original URL using a custom algorithm that:
  - Compresses the URL using run-length encoding
  - Obfuscates the result using a custom character mapping (not Base64)
  - Ensures the result is URL-safe
- The shareable URL refers back to this site and includes the encoded URL
- When a user visits the shareable URL:
  - The app decodes the original URL
  - Displays the original URL to the user
  - Provides a button to continue to the article
  - Automatically redirects to the original URL after a 5-second delay
- The app handles errors if the URL is invalid or corrupted

## Visual Requirements:
- Uses a modern material design style that subtly incorporates colors of the Canadian flag
- Responsive design that works on all devices
- Includes Storybook with Atomic Design elements

## Technical Requirements:
- Built with React 18
- Uses Vite as the build system
- Styled with TailwindCSS
- Uses React Router for navigation
- Does not require any back-end services to function
- All processing happens client-side in the browser

## Deployment
- Deploys on Amazon S3 as a static site
- Uses AWS CloudFront for CDN
- Deployment pattern is codified in the CloudFront template