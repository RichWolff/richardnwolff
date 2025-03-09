'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type ImageDocsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ImageDocsModal({ isOpen, onClose }: ImageDocsModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title 
                  as="h3" 
                  className="text-xl font-bold leading-6 text-gray-900 dark:text-white mb-4"
                >
                  Adding Images to Your Post
                </Dialog.Title>
                
                <div className="mt-4 prose prose-lg dark:prose-invert max-w-none">
                  <h4>Basic Image Syntax</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto">
                    <code>![Alt text](/path/to/image.jpg)</code>
                  </pre>
                  
                  <h4 className="mt-6">Size Control</h4>
                  <p>Control the size of your images by adding a <code>size</code> parameter:</p>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto">
                    <code>![Alt text](/path/to/image.jpg?size=large)</code>
                  </pre>
                  
                  <p className="mt-2">Available sizes:</p>
                  <ul>
                    <li><code>small</code> - 384px max width</li>
                    <li><code>medium</code> - 672px max width (default)</li>
                    <li><code>large</code> - 896px max width</li>
                    <li><code>full</code> - 100% width</li>
                  </ul>
                  
                  <h4 className="mt-6">Adding Captions</h4>
                  <p>Add a caption to your image with the <code>caption</code> parameter:</p>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto">
                    <code>![Alt text](/path/to/image.jpg?caption=This is a caption for the image)</code>
                  </pre>
                  
                  <h4 className="mt-6">Combining Parameters</h4>
                  <p>You can combine both size and caption parameters:</p>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto">
                    <code>![Alt text](/path/to/image.jpg?size=large&caption=This is a caption for the image)</code>
                  </pre>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h5 className="text-blue-800 dark:text-blue-300 font-medium">Pro Tip</h5>
                    <p className="text-blue-700 dark:text-blue-400 mb-0">
                      For the best visual experience, use images with the correct aspect ratio for your content. 
                      For blog headers, a 16:9 or 2:1 aspect ratio works well.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 