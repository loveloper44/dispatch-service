import { Command } from '@nest-kr/cqrs';

export class RequestDispatchCommand implements Command {
  constructor(
    public readonly address: string,
    public readonly passenger: Passenger,
  ) {}
}

export interface Passenger {
  id: string;
  email: string;
}
