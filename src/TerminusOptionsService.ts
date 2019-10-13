import {
  TerminusEndpoint,
  TerminusOptionsFactory,
  TerminusModuleOptions,
} from '@nestjs/terminus';

import { Injectable } from '@nestjs/common';

import { Application } from '@root/Application';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  constructor(private readonly application: Application) {}

  createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: '/health',
      healthIndicators: [async () => this.application.checkHealth()],
    };
    return {
      endpoints: [healthEndpoint],
    };
  }
}
