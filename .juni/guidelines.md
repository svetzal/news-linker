# News Linker

In Canada, Facebook will not allow users to paste news stories. This situation was created by the Canadian Government standing up for Canadian Media, however it has resulted in this ridiculous lash-back which has constrained peoples' ability to share proper news sources, and thus has allowed Canadians to be inundated with fake-news feeds that are not blocked.

This site will be a free service that allows a user to paste a URL, and then will create a derivative URL that they can then post to Facebook. When a user clicks that link in Facebook, they will land on this app, where they will be able to click through to visit the actual original URL.

Functional Requirements:
- the default page must allow the user to enter an URL
- this site will encode the original URL in its entirety in a reversable obfuscated format, ideally also compressed in some way
- the encoded URL format should not be a well-known format like Base64 because Facebook will likely be able to see that it's a URL it would have blocked
- the URL produced by this site will refer back to this site, and include the encoded URL
- when that page is loaded, it will present a short message, decode the URL, and present a link to that original URL

Visual Requirements:
- Use a modern material design style, that subtely incorporates colours of the Canadian flag
- Create a Storybook with Atomic Design elements to build up from the raw design language up through the components used on the site

Technical Requirements:
- Build the site in react + vite + tailwindcss
- It should not require any back-end services in order to function
- The application is contained in the "news-linker" folder
