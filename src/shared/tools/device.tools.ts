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
// export function isMobile() {
//   return isAndroid() || isIOS() || isWindowsPhone();
// }

// export function isMacOS() {
//   return globalThis.navigator.userAgent.p navigator.platform.toLowerCase().indexOf('mac') >= 0;
// }

// export function isIOS() {
//   const iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];

//   if (!!navigator.platform && iDevices.indexOf(navigator.platform) > -1) {
//     return true;
//   }

//   return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
// }

// export function isAndroid() {
//   const ua = navigator.userAgent.toLowerCase();
//   return ua.indexOf('android') > -1;
// }

// export function isWindowsPhone() {
//   if (navigator.userAgent.match(/Windows Phone/i)) {
//     return true;
//   }

//   if (navigator.userAgent.match(/iemobile/i)) {
//     return true;
//   }

//   if (navigator.userAgent.match(/WPDesktop/i)) {
//     return true;
//   }

//   return false;
// }

// function isAppleDevice() {
//   const iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod', 'MacIntel'];

//   if (!!navigator.platform) {
//     return iDevices.indexOf(navigator.platform) > -1;
//   }

//   return /iPad|iPhone|iPod|Mac\sOS\sX/.test(navigator.userAgent) && !window.MSStream;
// }
