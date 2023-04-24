export class ErrorUnexpectedStatus extends Error {
  constructor(public readonly status: number, url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH') {
    super(`Unexpected http status ${status}; url: ${url} ; method: ${method}`);
  }
}
