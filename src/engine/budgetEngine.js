import { BUDGET_LABELS } from '../config/constants.js';

export function getBudgetLabel(level) {
  return BUDGET_LABELS[level] ?? '不明';
}
