export const errors =  {
  '0': 'Unknown error',
  '10001': 'User already exists!',
  '10002': 'User not found',
  '10003': 'Wrong password or username'

}

export const error = (errorCode)=>{
  return {
    code: errorCode,
    message: errors[errorCode]
  }
}

export default error