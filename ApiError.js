class ApiError extends Error{
    constructor(name, statusCode, errorCode, message = null){
        super(message||name)
            this.name = name
            this.status = statusCode
            this.errorCode = errorCode
        }
    }

class InvalidInputError extends ApiError {
    constructor() {
        super('invalidInputError', 400, 'INVALID_INPUT_DATA');
    }}

class BadRequest extends ApiError {
    constructor() {
        super('badRequest', 400, 'BAD_REQUEST');
    }}

class NotFoundRes extends ApiError{
    constructor() {
        super('notFoundError', 404, "RESOURCE_NOT_FOUND")
    }}    

class InvalidUrl extends ApiError{
    constructor() {
        super('invalidUrl', 404, "RESOURCE_NOT_FOUND")
    }}

class DuplicatedRes extends ApiError{
    constructor() {
        super('duplicatedError', 409, "RESOURCE_ALREADY_EXISTS")
    }}

class ServerError extends ApiError{
    constructor() {
        super('serverError', 500, "INTERNAL_SERVER_ERROR")
    }
}

class NotFoundRelRes extends ApiError{
    constructor() {
        super('notFoundRelError', 404, "RELATED_RESOURCE_NOT_FOUND")
    }
}

module.exports = {
    DuplicatedRes, 
    InvalidInputError,
    BadRequest,
    NotFoundRes,
    InvalidUrl,
    DuplicatedRes,
    ServerError,
    ApiError,
    NotFoundRelRes
  };