'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MDXImagesDocPage() {
  const [activeTab, setActiveTab] = useState<'usage' | 'api' | 'examples'>('usage');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">MDX Images Documentation</h1>
        
        <div className="mb-8">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'usage' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('usage')}
            >
              Usage
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'api' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('api')}
            >
              API
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'examples' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('examples')}
            >
              Examples
            </button>
          </div>
          
          {activeTab === 'usage' && (
            <div className="prose prose-lg max-w-none">
              <h2>Basic Usage</h2>
              <p>
                Our MDX implementation includes a custom image component that enhances the standard markdown image syntax with additional features like size control and captions.
              </p>
              
              <p>The basic syntax for including an image in your MDX content is:</p>
              
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![Alt text](/path/to/image.jpg)`}
              </SyntaxHighlighter>
              
              <h3>Adding Size Control</h3>
              <p>
                You can control the size of your images by adding a <code>size</code> query parameter to the image URL:
              </p>
              
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![Alt text](/path/to/image.jpg?size=large)`}
              </SyntaxHighlighter>
              
              <p>Available size options are:</p>
              <ul>
                <li><code>small</code> - 384px max width</li>
                <li><code>medium</code> - 672px max width (default)</li>
                <li><code>large</code> - 896px max width</li>
                <li><code>full</code> - 100% width</li>
              </ul>
              
              <h3>Adding Captions</h3>
              <p>
                You can add a caption to your image by including a <code>caption</code> query parameter:
              </p>
              
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![Alt text](/path/to/image.jpg?caption=This is a caption for the image)`}
              </SyntaxHighlighter>
              
              <h3>Combining Parameters</h3>
              <p>
                You can combine both size and caption parameters:
              </p>
              
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![Alt text](/path/to/image.jpg?size=large&caption=This is a caption for the image)`}
              </SyntaxHighlighter>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 my-6">
                <h4 className="text-blue-800 font-medium mb-2">Pro Tip</h4>
                <p className="text-blue-700 mb-0">
                  For the best visual experience, use images with the correct aspect ratio for your content. For blog headers, a 16:9 or 2:1 aspect ratio works well.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div className="prose prose-lg max-w-none">
              <h2>API Reference</h2>
              
              <h3>MDXImage Component</h3>
              <p>
                The <code>MDXImage</code> component is automatically used for all images in your MDX content. It accepts the following props:
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Prop</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Default</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>src</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Required</td>
                      <td className="py-2">The image source URL</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>alt</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Required</td>
                      <td className="py-2">Alternative text for the image</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>width</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">1200</td>
                      <td className="py-2">The width of the image in pixels</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>height</code></td>
                      <td className="py-2">number</td>
                      <td className="py-2">Calculated</td>
                      <td className="py-2">The height of the image in pixels</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>size</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">'medium'</td>
                      <td className="py-2">The size of the image (small, medium, large, full)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>caption</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">undefined</td>
                      <td className="py-2">Optional caption text for the image</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>className</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">''</td>
                      <td className="py-2">Additional CSS classes to apply to the image container</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3>Query Parameters</h3>
              <p>
                When using the standard markdown image syntax, you can add the following query parameters to the image URL:
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Parameter</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>size</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Controls the size of the image (small, medium, large, full)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>caption</code></td>
                      <td className="py-2">string</td>
                      <td className="py-2">Adds a caption below the image</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'examples' && (
            <div className="prose prose-lg max-w-none">
              <h2>Examples</h2>
              
              <h3>Small Image</h3>
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![Small image example](/images/blog/small-example.svg?size=small)`}
              </SyntaxHighlighter>
              
              <div className="my-4">
                <div className="max-w-sm mx-auto relative aspect-video rounded-lg overflow-hidden">
                  <Image 
                    src="/images/blog/small-example.svg" 
                    alt="Small image example" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
              
              <h3>Medium Image (Default)</h3>
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![Medium image example](/images/blog/medium-example.svg)`}
              </SyntaxHighlighter>
              
              <div className="my-4">
                <div className="max-w-2xl mx-auto relative aspect-video rounded-lg overflow-hidden">
                  <Image 
                    src="/images/blog/medium-example.svg" 
                    alt="Medium image example" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
              
              <h3>Large Image</h3>
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![Large image example](/images/blog/large-example.svg?size=large)`}
              </SyntaxHighlighter>
              
              <div className="my-4">
                <div className="max-w-4xl mx-auto relative aspect-video rounded-lg overflow-hidden">
                  <Image 
                    src="/images/blog/large-example.svg" 
                    alt="Large image example" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
              
              <h3>Image with Caption</h3>
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![Sunset over mountains](/images/blog/sunset.svg?caption=A beautiful sunset over the mountains captured during golden hour)`}
              </SyntaxHighlighter>
              
              <div className="my-4">
                <figure className="max-w-2xl mx-auto">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image 
                      src="/images/blog/sunset.svg" 
                      alt="Sunset over mountains" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <figcaption className="text-center text-sm text-gray-600 mt-2 italic">
                    A beautiful sunset over the mountains captured during golden hour
                  </figcaption>
                </figure>
              </div>
              
              <h3>Full Width Image with Caption</h3>
              <SyntaxHighlighter language="markdown" style={vscDarkPlus}>
                {`![City skyline at night](/images/blog/city-night.svg?size=full&caption=City skyline at night with lights reflecting on the water)`}
              </SyntaxHighlighter>
              
              <div className="my-4">
                <figure className="w-full">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image 
                      src="/images/blog/city-night.svg" 
                      alt="City skyline at night" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <figcaption className="text-center text-sm text-gray-600 mt-2 italic">
                    City skyline at night with lights reflecting on the water
                  </figcaption>
                </figure>
              </div>
              
              <div className="mt-8">
                <Link 
                  href="/blog/using-images-in-mdx" 
                  className="text-blue-600 hover:underline font-medium"
                >
                  View the complete example blog post →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 