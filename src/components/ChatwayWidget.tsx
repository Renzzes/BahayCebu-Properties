import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CHATWAY_ID = 'AtFGBXpdRr6J';

interface ChatwayConfig {
  id: string;
  hideDefaultButton?: boolean;
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

  useEffect(() => {
    // Don't initialize chat widget on admin routes
    if (location.pathname.startsWith('/admin')) {
      // Clean up if we navigate to admin route
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      // Remove any elements created by Chatway
      const chatwayElements = document.querySelectorAll('[id^="chatway"]');
      chatwayElements.forEach(element => element.remove());
      return;
    }

    // If script is already loaded, don't add it again
    if (scriptRef.current) {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.id = 'chatway';
    script.async = true;
    script.src = `https://cdn.chatway.app/widget.js?id=${CHATWAY_ID}`;
    scriptRef.current = script;

    // Initialize Chatway with custom configuration after script loads
    script.onload = () => {
      if (window.Chatway) {
        window.Chatway.init({
          id: CHATWAY_ID,
          hideDefaultButton: true, // This will hide the default "Need Help" button
        });
      }
    };

    // Add script to document
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      // Remove any elements created by Chatway
      const chatwayElements = document.querySelectorAll('[id^="chatway"]');
      chatwayElements.forEach(element => element.remove());
    };
  }, [location.pathname]); // Re-run effect when pathname changes

  return null;
};

export default ChatwayWidget; 