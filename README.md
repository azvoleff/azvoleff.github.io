# Alex Zvoleff's Website

Personal website built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/azvoleff/azvoleff.com.git
   cd azvoleff.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:8080`

### Build

To build the site for production:

```bash
npm run build
```

The built site will be in the `_site` directory.

## Project Structure

```
├── src/
│   ├── _data/          # Global data files
│   ├── _includes/      # Partial templates
│   ├── _layouts/       # Page layouts
│   ├── blog/           # Blog posts (Markdown)
│   ├── css/            # Stylesheets
│   ├── images/         # Image assets
│   ├── about.md        # About page
│   ├── applications.md # Applications page
│   ├── research.md     # Research page
│   └── index.njk       # Homepage
├── eleventy.config.js  # Eleventy configuration
└── package.json
```

## Writing Blog Posts

Create a new Markdown file in `src/blog/` with the following frontmatter:

```markdown
---
title: Your Post Title
date: 2024-01-15
description: A brief description of the post.
---

Your content here...
```

Posts are automatically sorted by date and displayed on the blog page.

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The GitHub Actions workflow handles building and deploying the site.

### GitHub Pages Setup

1. Go to your repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to the `main` branch to trigger a deployment

## License

Content © Alex Zvoleff. All rights reserved.
