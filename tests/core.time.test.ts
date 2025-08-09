import { DateTime } from 'luxon';
import { inQuietHours } from '@getitdone/core/time';

test('quiet hours basic', () => {
  const dt = DateTime.fromISO('2025-01-01T22:00:00', { zone: 'America/Edmonton' });
  expect(inQuietHours(dt, 21*60, 7*60)).toBe(true);
});
