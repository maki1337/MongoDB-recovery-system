import * as express from "express";

export class ErrorResponse extends Error {
  private error?: any;
  public code: number;
  public success: boolean;

  constructor(code?: number, message?: string, error?: string) {
    super(message || "Error occured");
    this.name = "ErrorResponse";
    this.code = code || 500;
    this.success = false;
    this.error = error;
  }

  send(expressResponse: express.Response): void {
    expressResponse.status(this.code);
    expressResponse.send(this);
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      success: this.success,
    };
  }
}
