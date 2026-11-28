import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

// Makes every error use the Standard Error Response from Lab 05
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  /**
   * Runs whenever an error is thrown anywhere in the app.
   * It builds the standard error response: success, statusCode, message, errors, timestamp.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    // Default values for an unexpected error (500).
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error.';
    let errors: string[] = ['Something went wrong on the server.'];

    // Errors we throw on purpose (400, 401, 403, 404, 409, ...).
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r: any = exception.getResponse();

      // Case 1: the error response is a plain text message.
      if (typeof r === 'string') {
        message = r;
        errors = [r];
      // Case 2: validation errors from class-validator (a list of messages).
      } else if (Array.isArray(r.message)) {
        // validation errors from class-validator
        message = 'Invalid request data.';
        errors = r.message;
      } else {
        // Case 3: our own exceptions, thrown with { message, errors }.
        message = r.message ?? message;
        errors = r.errors ?? [r.message ?? message];
      }

      // The 401 from the JWT guard has no errors list, so we add a clear one.
      if (status === HttpStatus.UNAUTHORIZED && !r.errors) {
        message = message === 'Unauthorized' ? 'Authentication required.' : message;
        errors = ['No token, invalid token, or token has expired.'];
      }
    } else {
      // A real bug: log it on the server and send only a generic message to the client.
      this.logger.error(exception);
    }

    // Send the standard error response.
    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
