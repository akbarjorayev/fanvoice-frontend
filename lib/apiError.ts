export class ApiError extends Error {
  code: string
  params?: Record<string, string | number>

  constructor(code: string, params?: Record<string, string | number>) {
    super(code)
    this.name = 'ApiError'
    this.code = code
    this.params = params
  }
}
