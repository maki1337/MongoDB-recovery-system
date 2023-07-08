import * as express from "express";
export class Response {
  private code: number;
  private message: string | undefined;
  private success: boolean;

  constructor(code: number, message: string | undefined, success) {
    this.code = code;
    this.message = message;
    this.success = success;
  }
  setMessage(message: string): Response {
    this.message = message;
    return this;
  }
  setCode(code: number): Response {
    this.code = code;
    return this;
  }
  getCode(): number {
    return this.code;
  }
  send(expressResponse: express.Response): void {
    expressResponse.status(this.code);
    expressResponse.send(this);
  }
}
