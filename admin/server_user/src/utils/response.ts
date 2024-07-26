interface SuccessResponse<T> {
    status: 'ok';
    statusCode: number;
    result: T;
}

interface ErrorResponse <T>{
    status: 'error';
    statusCode: number;
    result: T;
}

const success = <T>(statusCode: number, result: T): SuccessResponse<T> => {
    return {
        status: 'ok',
        statusCode,
        result
    };
};

const error = <T>(statusCode: number, result:T): ErrorResponse <T>=> {
    return {
        status: 'error',
        statusCode,
        result
    };
};

export { success, error, SuccessResponse, ErrorResponse };
