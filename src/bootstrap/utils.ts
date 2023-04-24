import { URL } from 'url';

class BootstrapError extends Error {}

function fetchBoolean(envKey: string): boolean {
  const data = process.env[envKey];
  if (!data) {
    throw new BootstrapError(`Env key ${envKey} required`);
  }
  if (data !== 'true' && data !== 'false') {
    throw new BootstrapError('Invalid env: true or false expected');
  }
  return data === 'true';
}

function fetchPositiveNonZeroInt(envKey: string): number {
  const val = process.env[envKey];
  if (val === undefined || val === '') {
    throw new BootstrapError(`Value in env: ${envKey} - required`);
  }
  const res = Number(val);
  if (!Number.isInteger(res)) {
    throw new BootstrapError(`Value in env: ${envKey} - must be an integer`);
  }
  if (res <= 0) {
    throw new BootstrapError('Argument must be a positive and non zero');
  }

  return res;
}

function fetchStringOrEmptyString(envKey: string): string {
  const val = process.env[envKey];
  if (val === undefined) {
    return '';
  }
  return val;
}

function fetchString(envKey: string): string {
  const val = process.env[envKey];
  if (val === undefined || val === '') {
    throw new BootstrapError(`Value in env: ${envKey} - required`);
  }

  return val;
}

function fetchUrl(envKey: string): string {
  const url = process.env[envKey];
  if (url === undefined) {
    throw new BootstrapError(`Value in env: ${envKey} - required`);
  }
  try {
    new URL(url);
  } catch (error) {
    throw new BootstrapError(`Invalid url: ${error.message}`);
  }
  return url;
}

function fetchOneOfEnabled<T>(envKey: string, enabled: T[]): T {
  const data = process.env[envKey];
  if (data === undefined) {
    throw new BootstrapError(`Value in env: ${envKey} - required`);
  }

  if (!enabled.includes(data as T)) {
    throw new BootstrapError(`Disabled value: - ${data}, enabled: - ${enabled.join(', ')}`);
  }

  return data as T;
}

function parsePositiveNonZeroInt(datum: string): number {
  if (datum === undefined || datum === '') {
    throw new BootstrapError(`Empty value disallowed`);
  }
  const res = Number(datum);
  if (!Number.isInteger(res)) {
    throw new BootstrapError(`Value must be an integer`);
  }
  if (res <= 0) {
    throw new BootstrapError('Value must be a positive and non zero');
  }
  return res;
}

export {
  fetchBoolean,
  fetchPositiveNonZeroInt,
  fetchStringOrEmptyString,
  fetchString,
  fetchUrl,
  fetchOneOfEnabled,
  parsePositiveNonZeroInt,
};
