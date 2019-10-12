import { Command } from '@nest-kr/cqrs';

export class MatchDispatchCommand implements Command {
  constructor(
    public readonly dispatchId: string,
    public readonly driver: Driver,
  ) {}
}

export interface Driver {
  id: string;
  email: string;
}
