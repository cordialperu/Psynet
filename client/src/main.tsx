import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('main.tsx loaded, initializing app...');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

// Error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  console.error('Error message:', event.message);
  console.error('Stack trace:', event.error?.stack);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  console.error('Promise:', event.promise);
});

const root = document.getElementById("root");
console.log('Root element:', root);

if (root) {
  console.log('Creating React root and rendering...');
  try {
    createRoot(root).render(<App />);
    console.log('App render initiated');
  } catch (error) {
    console.error('Failed to render app:', error);
  }
} else {
  console.error('Root element not found! Document body:', document.body);
}
