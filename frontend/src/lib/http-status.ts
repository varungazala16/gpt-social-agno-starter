/**
 * HTTP Status Code Constants
 * 
 * Based on RFC 7231 and other HTTP specifications
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */

// 1xx Informational
export const CONTINUE = 100
export const SWITCHING_PROTOCOLS = 101

// 2xx Success
export const OK = 200
export const CREATED = 201
export const ACCEPTED = 202
export const NO_CONTENT = 204

// 3xx Redirection
export const MOVED_PERMANENTLY = 301
export const FOUND = 302
export const NOT_MODIFIED = 304
export const TEMPORARY_REDIRECT = 307

// 4xx Client Error
export const BAD_REQUEST = 400
export const UNAUTHORIZED = 401
export const PAYMENT_REQUIRED = 402
export const FORBIDDEN = 403
export const NOT_FOUND = 404
export const METHOD_NOT_ALLOWED = 405
export const CONFLICT = 409
export const UNPROCESSABLE_ENTITY = 422
export const TOO_MANY_REQUESTS = 429

// 5xx Server Error
export const INTERNAL_SERVER_ERROR = 500
export const NOT_IMPLEMENTED = 501
export const BAD_GATEWAY = 502
export const SERVICE_UNAVAILABLE = 503
export const GATEWAY_TIMEOUT = 504

// Grouped exports for convenience
export const HttpStatus = {
  // 1xx
  CONTINUE,
  SWITCHING_PROTOCOLS,
  
  // 2xx
  OK,
  CREATED,
  ACCEPTED,
  NO_CONTENT,
  
  // 3xx
  MOVED_PERMANENTLY,
  FOUND,
  NOT_MODIFIED,
  TEMPORARY_REDIRECT,
  
  // 4xx
  BAD_REQUEST,
  UNAUTHORIZED,
  PAYMENT_REQUIRED,
  FORBIDDEN,
  NOT_FOUND,
  METHOD_NOT_ALLOWED,
  CONFLICT,
  UNPROCESSABLE_ENTITY,
  TOO_MANY_REQUESTS,
  
  // 5xx
  INTERNAL_SERVER_ERROR,
  NOT_IMPLEMENTED,
  BAD_GATEWAY,
  SERVICE_UNAVAILABLE,
  GATEWAY_TIMEOUT,
} as const

export default HttpStatus