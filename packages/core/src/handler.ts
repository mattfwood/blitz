import {IncomingMessage} from 'http'
import {ActionInput} from '../types/action'
import {ValidationFn} from '../types/validation'

export function createValidHandler<HI extends ActionInput, O>(
  handler: (input: HI) => Promise<O>,
  validateInput: ValidationFn,
): (input: HI) => Promise<O> {
  return function(input) {
    // Will throw on error
    validateInput(input.data)

    return handler(input)
  }
}

export function createServerHandler<I, HI extends ActionInput, O>(handler: (input: HI) => Promise<O>) {
  return function(rawInput: I, req: IncomingMessage) {
    // Perform request authentication here so we can pass the user context to the handler
    console.log(req) // so TS doesn't yell about unused variable

    const input = {
      data: rawInput,
      user: {
        id: null,
        roles: [],
      },
    }

    return handler((input as unknown) as HI)
  }
}
