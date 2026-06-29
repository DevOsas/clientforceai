/**
 * Clientforce Forms Embed Script
 * 
 * This script automatically resizes form iframes based on their content
 * and handles communication between embedded forms and parent pages.
 */

(function() {
  'use strict';

  // Find all Clientforce form iframes
  const iframes = document.querySelectorAll('iframe[src*="clientforce.io/f/"]');

  iframes.forEach(function(iframe) {
    // Enable seamless iframe resizing
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.width = '100%';

    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
      // Security: Verify origin
      if (!event.origin.includes('clientforce.io')) {
        return;
      }

      const data = event.data;

      // Handle iframe height resize
      if (data.type === 'FORM_RESIZE' && data.height) {
        iframe.style.height = data.height + 'px';
      }

      // Handle form submission
      if (data.type === 'FORM_SUBMITTED') {
        console.log('Form submitted:', data);
        
        // Dispatch custom event for parent page to listen
        const submitEvent = new CustomEvent('clientforceFormSubmit', {
          detail: {
            formId: data.formId,
            data: data.data
          }
        });
        document.dispatchEvent(submitEvent);

        // Optional: Redirect or show thank you message
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        }
      }
    });

    // Request initial height from iframe
    iframe.addEventListener('load', function() {
      iframe.contentWindow.postMessage({ type: 'REQUEST_HEIGHT' }, '*');
    });
  });

  // Auto-resize observer for dynamic content
  if (window.ResizeObserver) {
    iframes.forEach(function(iframe) {
      const observer = new ResizeObserver(function() {
        iframe.contentWindow.postMessage({ type: 'REQUEST_HEIGHT' }, '*');
      });
      observer.observe(iframe);
    });
  }

  console.log('Clientforce Forms: Initialized ' + iframes.length + ' form(s)');
})();
