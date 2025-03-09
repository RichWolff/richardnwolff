# Richard Wolff's Personal Website

This is my personal website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Blog with MDX Support**: Write blog posts using MDX with custom components
- **Image Handling**: Custom image component with size control and captions
- **Responsive Design**: Fully responsive layout for all devices
- **Dark Mode Support**: Toggle between light and dark themes
- **SEO Optimized**: Meta tags and structured data for better search engine visibility

## MDX Image Component

The website includes a custom MDX image component that enhances the standard markdown image syntax with additional features:

### Basic Usage

```markdown
![Alt text](/path/to/image.jpg)
```

### Size Control

Control the size of your images by adding a `size` query parameter:

```markdown
![Alt text](/path/to/image.jpg?size=large)
```

Available sizes:
- `small` - 384px max width
- `medium` - 672px max width (default)
- `large` - 896px max width
- `full` - 100% width

### Adding Captions

Add a caption to your image with the `caption` query parameter:

```markdown
![Alt text](/path/to/image.jpg?caption=This is a caption for the image)
```

### Combining Parameters

You can combine both size and caption parameters:

```markdown
![Alt text](/path/to/image.jpg?size=large&caption=This is a caption for the image)
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## License

MIT
