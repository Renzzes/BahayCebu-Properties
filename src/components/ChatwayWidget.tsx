import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CHATWAY_ID = 'AtFGBXpdRr6J';

interface ChatwayConfig {
  id: string;
  hideDefaultButton?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  offset?: {
    bottom?: string;
    right?: string;
    left?: string;
  };
  styles?: {
    button?: Record<string, string>;
    widget?: Record<string, string>;
  };
}

declare global {
  interface Window {
    Chatway?: {
      init: (config: ChatwayConfig) => void;
    };
  }
}

const ChatwayWidget = () => {
  const location = useLocation();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isInitialized = useRef(false);

  // Function to check if we should show the widget on current page
  const shouldShowWidget = (pathname: string) => {
    const allowedPaths = ['/', '/properties', '/property'];
    return allowedPaths.some(path => pathname.startsWith(path));
  };

  const cleanup = () => {
    // Remove script if it exists
    if (scriptRef.current?.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    
    // Remove any elements created by Chatway
    const chatwayElements = document.querySelectorAll('[id^="chatway"]');
    chatwayElements.forEach(element => element.remove());
    
    isInitialized.current = false;

    // Remove any custom styles
    const customStyle = document.getElementById('chatway-custom-styles');
    if (customStyle) {
      customStyle.remove();
    }
  };

  const addCustomStyles = () => {
    const style = document.createElement('style');
    style.id = 'chatway-custom-styles';
    style.textContent = `
      #chatway-widget {
        z-index: 1000 !important;
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        max-width: 400px !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
      #chatway-button {
        background-color: #10B981 !important;
        border-radius: 50% !important;
        width: 60px !important;
        height: 60px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25) !important;
        transition: all 0.3s ease !important;
      }
      #chatway-button:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3) !important;
      }
      .chatway-iframe {
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    // Check if we should show the widget on current page
    if (!shouldShowWidget(location.pathname)) {
      cleanup();
      return;
    }

    // If script is already loaded and initialized, don't add it again
    if (scriptRef.current && isInitialized.current) {
      return;
    }

    // Add custom styles
    addCustomStyles();

    // Create script element if it doesn't exist
    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.id = 'chatway';
      script.async = true;
      script.src = `https://cdn.chatway.app/widget.js?id=${CHATWAY_ID}`;
      scriptRef.current = script;

      // Add error handling for script loading
      script.onerror = () => {
        console.warn('Chatway widget failed to load. This may be due to an ad blocker.');
        cleanup(); // Clean up any partial widget elements
        isInitialized.current = false;
      };

      // Initialize Chatway with custom configuration after script loads
      script.onload = () => {
        try {
          if (window.Chatway) {
            window.Chatway.init({
              id: CHATWAY_ID,
              hideDefaultButton: false,
              position: 'bottom-right',
              offset: {
                bottom: '20px',
                right: '20px'
              },
              styles: {
                button: {
                  backgroundColor: '#10B981',
                  borderRadius: '50%',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                },
                widget: {
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }
            });
            isInitialized.current = true;
          }
        } catch (error) {
          console.warn('Failed to initialize Chatway widget:', error);
          cleanup(); // Clean up any partial widget elements
          isInitialized.current = false;
        }
      };

      // Add script to document
      document.body.appendChild(script);
    }

    // Cleanup on unmount or when leaving allowed pages
    return cleanup;
  }, [location.pathname]); // Re-run effect when pathname changes

  return null;
};

export default ChatwayWidget; 