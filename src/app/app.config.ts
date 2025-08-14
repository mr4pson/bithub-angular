import { IKeyValue } from './model/keyvalue';

export interface IConfig {
  readonly siteUrl: string;
  readonly apiUrl: string;
  readonly wsUrl: string;
  readonly maxImageFileSize: number;
  readonly allowedImageTypes: string[];
}

const host = window.location.host;
const configs: IKeyValue<IConfig> = {
  'localhost:4200': {
    siteUrl: 'http://localhost:4200',
    apiUrl: 'http://localhost:3030/api/mainsite',
    wsUrl: 'wss://localhost:3030/socket',
    maxImageFileSize: 5000000,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  'app.bithab.vio.net.ua': {
    siteUrl: 'https://app.bithab.vio.net.ua',
    apiUrl: 'https://back.bithab.vio.net.ua/api/mainsite',
    wsUrl: 'wss://back.bithab.vio.net.ua/socket',
    maxImageFileSize: 5000000,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  'app.bithab.net': {
    siteUrl: 'https://app.bithab.net',
    apiUrl: 'https://back.bithab.net/api/mainsite',
    wsUrl: 'wss://back.bithab.net/socket',
    maxImageFileSize: 5000000,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  'app.drop.guide': {
    siteUrl: 'https://app.drop.guide',
    apiUrl: 'https://back.drop.guide/api/mainsite',
    wsUrl: 'wss://back.drop.guide/socket',
    maxImageFileSize: 5000000,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
};

export const cfg = configs[host];
