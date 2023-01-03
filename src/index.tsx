import React from 'react';
import { createRoot } from 'react-dom/client';

import './shared/theme/basic.css';
import './shared/theme/tooltip.css';
import { App } from './app';
import reportWebVitals from './reportWebVitals';
import { StateProvider, TelegramProvider } from './shared';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <StateProvider>
      <TelegramProvider>
        <App />
      </TelegramProvider>
    </StateProvider>
  </React.StrictMode>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
