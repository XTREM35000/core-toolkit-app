import { alertService } from '../services/alertService';

describe('alertService', () => {
  it('returns definitions for levels', () => {
    const defs = alertService.getDefinitions('CRITICAL');
    expect(Array.isArray(defs)).toBe(true);
    expect(defs.length).toBeGreaterThan(0);
  });
});
import { describe, it, expect, vi } from 'vitest';
import AlertService from '../services/alertService';

describe('AlertService', () => {
  it('calls configured channels', async () => {
    const sms = vi.fn(async () => { });
    const email = vi.fn(async () => { });
    const inApp = vi.fn(async () => { });

    const svc = new AlertService({ sms, email, inApp });

    await svc.dispatch({ level: 'CRITICAL', message: 'test' }, { sms: ['+123'], email: ['a@b.c'], users: ['u1'] });

    expect(sms).toHaveBeenCalled();
    expect(email).toHaveBeenCalled();
    expect(inApp).toHaveBeenCalled();
  });
});
