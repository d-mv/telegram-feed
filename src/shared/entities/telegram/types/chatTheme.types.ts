import { TUpdate } from './event.types';
import { TFile } from './file.types';
import { TThumbnail } from './photo.types';

export interface TChatThemeSettingsDocument {
  '@type': 'document';
  document: TFile;
  file_name: string;
  mime_type: string;
  thumbnail: TThumbnail;
}

export interface TChatThemeSettingsFill {
  '@type': 'backgroundFillFreeformGradient';
  colors: number[];
}

export interface TChatThemeSettingsBackgroundType {
  '@type': 'backgroundTypePattern';
  fill: TChatThemeSettingsFill;
  intensity: number;
  is_inverted: boolean;
  is_moving: boolean;
}

export interface TChatThemeSettingsBackground {
  '@type': 'background';
  document: TChatThemeSettingsDocument;
  id: string;
  is_dark: boolean;
  is_default: boolean;
  name: string;
  type: TChatThemeSettingsBackgroundType;
}

export interface TChatThemeSettings {
  '@type': 'themeSettings';
  accent_color: number;
  animate_outgoing_message_fill: boolean;
  background: TChatThemeSettingsBackground;
  outgoing_message_accent_color: number;
  outgoing_message_fill: TChatThemeSettingsFill;
}

export interface TChatTheme {
  '@type': 'chatTheme';
  dark_settings: TChatThemeSettings;
  light_settings: TChatThemeSettings;
  name: string;
}

// updates
export interface TUpdateChatThemes extends TUpdate {
  '@type': 'updateChatThemes';
  chat_themes: TChatTheme[];
}
