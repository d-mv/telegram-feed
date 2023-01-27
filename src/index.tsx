import { logger } from '@mv-d/toolbelt';
import { createRoot } from 'react-dom/client';

import './shared/theme/media.css';
import './shared/theme/tooltip.css';
import { App } from './app';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(logger.dir);
