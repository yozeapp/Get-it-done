import { RRule, RRuleSet, rrulestr } from 'rrule';

export function previewOccurrences(rruleText: string, start: Date, count = 10) {
  const rule = rrulestr(rruleText) as RRule | RRuleSet;
  return rule.all((_, i) => i < count, start);
}
