import moment from 'moment';
import * as timeFormats from '../timeFormats';

const outputBase = {
  integer: (text: string) => {
    return parseInt(text, 10);
  },
  date: (text: string) => {
    const d = moment.utc(text).toDate();
    return d;
  },
};

interface SerDe {
  [key: string]: {
    input: null | ((input: any, ctx?: any) => any);
    output: null | ((input: any, ctx?: any) => any);
  };
}

export const types = {
  FlightLevel_DataType: {
    input: null,
    output: outputBase.integer,
  },
  DurationHourMinute: {
    input: (d: number): string => {
      const totalMinutes = Math.floor(d / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}`.padStart(2, '0') + `${minutes}`.padStart(2, '0');
    },
    output: (s: string): number => {
      const hours = parseInt(s.slice(0, 2), 10);
      const minutes = parseInt(s.slice(2), 10);

      return 60 * (60 * hours + minutes);
    },
  },
  DurationHourMinuteSecond: {
    input: (d: number): string => {
      const totalMinutes = Math.floor(d / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return (
        `${hours}`.padStart(2, '0') +
        `${minutes}`.padStart(2, '0') +
        `${d % 60}`.padStart(2, '0')
      );
    },
    output: (s: string): number => {
      const hours = parseInt(s.slice(0, 2), 10);
      const minutes = parseInt(s.slice(2, 4), 10);
      const seconds = parseInt(s.slice(4), 10);

      return 3600 * hours + 60 * minutes + seconds;
    },
  },
  DurationMinute: {
    input: (d: number): number => Math.floor(d / 60),
    output: (d: number): number => 60 * d,
  },
  CountsValue: {
    input: null,
    output: outputBase.integer,
  },
  DateTimeMinute: {
    input: (d: Date): string => moment(d).utc().format(timeFormats.timeFormat),
    output: outputBase.date,
  },
  DateYearMonthDay: {
    input: (d: Date): string => moment(d).utc().format(timeFormats.dateFormat),
    output: outputBase.date,
  },
  DateTimeSecond: {
    input: (d: Date): string =>
      moment(d).utc().format(timeFormats.timeFormatWithSeconds),
    output: outputBase.date,
  },
  DistanceNM: {
    input: null,
    output: outputBase.integer,
  },
  DistanceM: {
    input: null,
    output: outputBase.integer,
  },
  Bearing: {
    input: null,
    output: outputBase.integer,
  },
  OTMVThreshold: {
    input: null,
    output: outputBase.integer,
  },
} satisfies SerDe;
