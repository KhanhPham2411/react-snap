export interface ICaller {
  typeName: string;
  functionName: string;
  methodName: string;
  filePath: string;
  lineNumber: number;
  topLevelFlag: boolean;
  nativeFlag: boolean;
  evalFlag: boolean;
  evalOrigin: string;
}
export interface ISnapshot {
  eval?: any;
  id?: string;
  className?: string;
  functionName?: string;
  functionId?: string;
  caller?: ICaller;
  callerId?: string;
  classObject?: any;
  classObjectAfter?: any;
  input?: any[];
  inputAfter?: any[];
  output?: any;
  creationTime?: number;
  creationTimeString?: string;
  elapsedTime?: number;
  isPrototype?: boolean;
  mocks?: ISnapshot[];
  mockFunction?: any;
  params?: string[];
}
