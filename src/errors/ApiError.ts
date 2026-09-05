export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly detalles?: string[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
