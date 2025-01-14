import { inspect } from 'util';
import { makeFlowClient, B2BClient, NMB2BError } from '..';
import moment from 'moment';
import b2bOptions from '../../tests/options';
import { RunwayConfigurationPlanRetrievalReply } from './types';
import { expect, test, describe } from 'vitest';
import { shouldUseRealB2BConnection } from '../../tests/utils';

describe('retrieveRunwayConfigurationPlan', async () => {
  const Flow = await makeFlowClient(b2bOptions);

  test.runIf(shouldUseRealB2BConnection)('LFBD', async () => {
    try {
      const res: RunwayConfigurationPlanRetrievalReply =
        await Flow.retrieveRunwayConfigurationPlan({
          dataset: { type: 'OPERATIONAL' },
          day: moment.utc().toDate(),
          aerodrome: 'LFBD',
        });

      expect(res.data).toBeDefined();
      expect(res.data.plan.planCutOffReached).toEqual(expect.any(Boolean));
      expect(res.data.plan).toMatchObject({
        aerodrome: 'LFBD',
        planTransferred: expect.any(Boolean),
        planCutOffReached: expect.any(Boolean),
        knownRunwayIds: {
          item: expect.arrayContaining([expect.stringMatching(/^[0-9]{2}/)]),
        },
        nmSchedule: {
          item: expect.any(Array),
        },
        clientSchedule: {
          item: expect.any(Array),
        },
      });
    } catch (err) {
      if (err instanceof NMB2BError) {
        console.log(inspect(err, { depth: 4 }));
      }

      throw err;
    }
  });
});
