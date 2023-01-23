import { StrictMode } from 'react';
import { logger } from '@mv-d/toolbelt';
import { createRoot } from 'react-dom/client';

import './shared/theme/tooltip.css';
import { App } from './app';
import reportWebVitals from './reportWebVitals';
import { StateProvider, TelegramProvider } from './shared';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <StateProvider>
      <TelegramProvider>
        <App />
      </TelegramProvider>
    </StateProvider>
  </StrictMode>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(logger.dir);
