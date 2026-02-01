import errorThrower from '../../helper/errorThrower.js';

describe('ErrorThrower Helper', () => {
  it('should create an error with status and message', () => {
    const error = errorThrower(400, 'Bad request');

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(400);
    expect(error.message).toBe('Bad request');
  });

  it('should create error with different status codes', () => {
    const notFoundError = errorThrower(404, 'Not found');
    const serverError = errorThrower(500, 'Internal server error');
    const unauthorizedError = errorThrower(401, 'Unauthorized');

    expect(notFoundError.status).toBe(404);
    expect(serverError.status).toBe(500);
    expect(unauthorizedError.status).toBe(401);
  });

  it('should preserve error stack trace', () => {
    const error = errorThrower(400, 'Test error');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('errorThrower');
  });

  it('should handle empty message', () => {
    const error = errorThrower(400, '');

    expect(error.message).toBe('');
    expect(error.status).toBe(400);
  });
});
