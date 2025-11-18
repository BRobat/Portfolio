import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    console.error('Global error handler caught:', error);

    // In production, you might want to send this to a logging service
    // like Sentry, LogRocket, etc.

    // Show user-friendly error message
    const message = this.getErrorMessage(error);
    this.showErrorToUser(message);
  }

  private getErrorMessage(error: Error): string {
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network.';
    }

    if (error.message.includes('404')) {
      return 'Resource not found.';
    }

    return 'An unexpected error occurred. Please try again later.';
  }

  private showErrorToUser(message: string): void {
    // You could implement a toast notification service here
    // For now, we'll just log it
    console.log('User-friendly error:', message);
  }
}
