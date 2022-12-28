const USER_AGENTS_OS = [
  ['Windows NT 10.0', 'Windows 10'],
  ['Windows NT 6.2', 'Windows 8'],
  ['Windows NT 6.1', 'Windows 7'],
  ['Windows NT 6.0', 'Windows Vista'],
  ['Windows NT 5.1', 'Windows XP'],
  ['Windows NT 5.0', 'Windows 2000'],
  ['Mac', 'Mac/iOS'],
  ['X11', 'UNIX'],
  ['Linux', 'Linux'],
];

export function getOSName() {
  let OSName = 'Unknown';

  if (!window.navigator) return OSName;

  const { userAgent } = window.navigator;

  USER_AGENTS_OS.forEach(([ua, os]) => {
    if (userAgent.indexOf(ua) !== -1) {
      OSName = os;
    }
  });

  return OSName;
}

const USER_AGENTS_BROWSERS = [
  ['Chrome', 'Chrome'],
  ['Safari', 'Safari'],
  ['Firefox', 'Firefox'],
  ['MSIE', 'IE'],
  ['Edge', 'Edge'],
];

export function getBrowser() {
  let browser_name = '';

  if (!window.navigator) return browser_name;

  const { userAgent } = window.navigator;

  if (/* @cc_on!@*/ false || 'documentMode' in document) return 'IE';

  if ('StyleMedia' in window) return 'Edge';

  USER_AGENTS_BROWSERS.forEach(([ua, browser]) => {
    if (userAgent.indexOf(ua) !== -1) {
      browser_name = browser;
    }
  });

  return browser_name;
}
