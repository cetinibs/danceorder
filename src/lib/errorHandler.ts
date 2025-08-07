export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  console.error('Error:', error);
  
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      status: error.statusCode
    };
  }

  return {
    error: 'Beklenmeyen bir hata oluştu',
    status: 500
  };
}; 