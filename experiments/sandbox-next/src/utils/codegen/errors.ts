export class CodegenError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = "CodegenError";
  }
}
