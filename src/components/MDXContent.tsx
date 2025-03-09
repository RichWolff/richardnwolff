'use client';

import { MDXRemote } from 'next-mdx-remote';
import MDXImage from './MDXImage';

const components = {
  img: MDXImage,
  // Add more custom components as needed
};

type MDXContentProps = {
  source: any;
};

export default function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote {...source} components={components} />;
} 