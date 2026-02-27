import { DISTANCE_LABELS } from '../config/constants.js';

export function getDistanceLabel(level) {
  return DISTANCE_LABELS[level] ?? '不明';
}
