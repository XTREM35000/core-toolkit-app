import { sendAlert } from './alertService';

describe('alertService', () => {
  test('sendAlert resolves and returns payload', async () => {
    const alert = { level: 'INFO', message: 'Test alert', code: 'TEST' } as any;
    const res = await sendAlert(alert, { inApp: true });
    expect(res).toHaveProperty('ok', true);
    expect(res.payload).toBeDefined();
  });
});
