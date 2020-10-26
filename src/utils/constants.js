import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const MIN_SEARCH_RADIUS = 50; // ~0.03 miles
export const MAX_SEARCH_RADIUS = 40000; // ~25 miles
export const DEFAULT_SEARCH_RADIUS = 9600; // ~6 miles
export const ASPECT_RATIO = deviceWidth / deviceHeight;
export const LATITUDE_DELTA = 0.25; // 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export const DEFAULT_CAMERA = {
  altitude: 1000,
  pitch: 10,
  zoom: 10,
  heading: 20,
};
export const mapTypes = [
  { index: 0, name: 'mutedStandard', displayName: 'Default' },
  { index: 1, name: 'hybrid', displayName: 'Hybrid' },
  { index: 2, name: 'satellite', displayName: 'Satellite' },
];

export const AVATAR_PLACEHOLDER_URL =
  'https://firebasestorage.googleapis.com/v0/b/local-courts-1536035788302.appspot.com/o/placeholder.png?alt=media&token=f297fe0f-ff64-41c7-a727-8f60e6fa9a07';
