import moment from 'moment';
import { describe, expect, test } from 'vitest';
import { makeAirspaceClient } from '..';
import b2bOptions from '../../tests/options';
import { shouldUseRealB2BConnection } from '../../tests/utils';

describe('retrieveAUPChain', async () => {
  const Airspace = await makeAirspaceClient(b2bOptions);

  test.runIf(shouldUseRealB2BConnection)('AUP Retrieval', async () => {
    const res = await Airspace.retrieveAUPChain({
      amcIds: ['LFFAZAMC'],
      chainDate: moment.utc().toDate(),
    });

    if (res.data === null) {
      console.warn(`Null data received, skipping test`);
      return;
    }

    expect(Array.isArray(res.data.chains)).toBe(true);
  });
});
