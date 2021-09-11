import { register } from './mock-handler';
export * from './mock-handler'

export const init = () => {
  register();
}