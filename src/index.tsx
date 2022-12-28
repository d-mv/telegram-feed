import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import reportWebVitals from './reportWebVitals';
import { CONFIG, StateProvider } from './shared';

const root = createRoot(document.getElementById('root') as HTMLElement);

if (!CONFIG.api.id || !CONFIG.api.hash) {
  globalThis.alert('Missing API keys');
}

root.render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
