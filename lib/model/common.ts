import { BasicStatistics } from './statistics';

export interface Degree {
  short: string;
  name: string;
  group: string;
}

export interface Country {
  cn: string;
  en: string;
  phone_code: string;
}

export interface OverviewProps<T = BasicStatistics> {
  data: T;
  title: string;
  icon: JSX.Element;
  style?: React.CSSProperties;
  mainKey?: 'amount' | 'total';
}
