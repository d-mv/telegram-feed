import { TFile } from './file.types';

export interface TMiniThumbnail {
  '@type': 'minithumbnail';
  data: string;
  height: number;
  width: number;
}

export interface TProfilePhoto {
  big: TFile;
  has_animation: boolean;
  id: string;
  minithumbnail: TMiniThumbnail;
  small: TFile;
}

export interface TThumbnailFormatPng {
  '@type': 'thumbnailFormatPng';
}

export interface TThumbnail {
  '@type': 'thumbnail';
  file: TFile;
  format: TThumbnailFormatPng;
  height: number;
  width: number;
}

export interface TPhotoSize {
  '@type': 'photoSize';
  height: number;
  photo: TFile;
  progressive_sizes: unknown[];
  type: string;
  width: number;
}
