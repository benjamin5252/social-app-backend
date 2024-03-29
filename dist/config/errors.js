export const errors = {
    '0': 'Unknown error',
    '10001': 'User already exists!',
    '10002': 'User not found',
    '10003': 'Wrong password or username',
    '10004': "Authentication error",
    '10005': "Format error",
    '10006': "Only for the current user"
};
export const error = (errorCode) => {
    if (errors[errorCode]) {
        return {
            code: errorCode,
            message: errors[errorCode]
        };
    }
    else {
        return {
            code: 0,
            message: errors[0]
        };
    }
};
export default error;
//# sourceMappingURL=errors.js.map