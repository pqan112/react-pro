export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error'
}
export type UploadStatus = (typeof Status)[keyof typeof Status]
