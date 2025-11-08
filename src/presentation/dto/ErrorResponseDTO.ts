import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for error responses.
 * Used for Swagger documentation of error responses.
 */
export class ErrorResponseDTO {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  public statusCode!: number;

  @ApiProperty({
    description: 'Error message describing what went wrong',
    example: 'Validation failed',
    type: String,
  })
  public message!: string;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  public timestamp!: string;
}

