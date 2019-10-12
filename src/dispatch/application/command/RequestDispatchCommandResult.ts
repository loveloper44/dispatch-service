import { CommandResult } from '@nest-kr/cqrs';

export class RequestDispatchCommandResult implements CommandResult {
  constructor(public readonly dispatchId: string) {}
}
