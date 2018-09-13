/* @flow */
import { inspect } from 'util';
import { makeFlowClient } from '../';
import moment from 'moment';
import b2bOptions from '../../tests/options';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

import type { RegulationListReply } from './queryRegulations';

const conditionalTest = global.__DISABLE_B2B_CONNECTIONS__ ? test.skip : test;
const xconditionalTest = xtest;

let Flow;
beforeAll(async () => {
  Flow = await makeFlowClient(b2bOptions);
});

describe('queryRegulations', () => {
  conditionalTest('List all regulations', async () => {
    try {
      const res: RegulationListReply = await Flow.queryRegulations({
        dataset: { type: 'OPERATIONAL' },
        queryPeriod: {
          wef: moment
            .utc()
            .subtract(10, 'hour')
            .startOf('hour')
            .toDate(),
          unt: moment
            .utc()
            .add(10, 'hour')
            .startOf('hour')
            .toDate(),
        },
        requestedRegulationFields: {
          item: [
            'applicability',
            'location',
            'reason',
            'linkedRegulations',
            'scenarioReference',
          ],
        },
      });

      const items = res.data.regulations.item;

      expect(items).toBeDefined();
      expect(items.length).toBeGreaterThanOrEqual(1);

      // console.warn(inspect(items, { depth: null }));
      //
      // const filteredItems = items.filter(
      //   ({ location }) =>
      //     location["referenceLocation-ReferenceLocationAirspace"]
      // );
      //
      //
      // console.warn(JSON.stringify(filteredItems, null, 2));
      // const airspaces = filteredItems.map(
      //   ({ location }) =>
      //     location["referenceLocation-ReferenceLocationAirspace"].id
      // );
      //
      // console.warn(JSON.stringify(airspaces, null, 2));

      items.forEach(item => {
        expect(item.regulationId).toBeDefined();
        expect(item.location).toBeDefined();

        if (
          item.location &&
          // $FlowFixMe: https://github.com/facebook/flow/issues/2990
          item.location['referenceLocation-ReferenceLocationAirspace']
        ) {
          expect(
            item.location['referenceLocation-ReferenceLocationAirspace'],
          ).toMatchObject({
            type: 'AIRSPACE',
            id: expect.any(String),
          });
        }
      });
    } catch (err) {
      console.log(inspect(err, { depth: null }));
      throw err;
    }
  });
});
