import { useEffect } from 'react';

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
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.id = 'chatway';
    script.async = true;
    script.src = `https://cdn.chatway.app/widget.js?id=${CHATWAY_ID}`;

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
      // Remove script from document
      document.body.removeChild(script);
      // Remove any elements created by Chatway
      const chatwayElements = document.querySelectorAll('[id^="chatway"]');
      chatwayElements.forEach(element => element.remove());
    };
  }, []);

  return null;
};

export default ChatwayWidget; 