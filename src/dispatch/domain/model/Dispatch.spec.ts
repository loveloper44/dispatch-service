import * as uuid from 'uuid';
import { Dispatch } from '@dispatch/domain/model/Dispatch';
import { Address } from './Address';
import { Passenger } from './Passenger';
import { DispatchStatus } from '@root/dispatch/constant';
import { clear, advanceTo } from 'jest-date-mock';
import { Driver } from './Driver';
import {
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';

describe('Dispatch', () => {
  let id: string;
  let driver: Driver;
  let passenger: Passenger;
  let dispatchWithIdle: Dispatch;
  let dispatchWithWaiting: Dispatch;
  let dispatchWithMatched: Dispatch;
  let dispatchWithCanceled: Dispatch;

  beforeAll(() => {
    advanceTo(new Date('2019-10-12T00:00:00.000Z'));
  });

  beforeEach(() => {
    id = uuid.v1();
    driver = new Driver('driver id', 'driver email');
    passenger = new Passenger('passenger id', 'passenger email');
    dispatchWithIdle = new Dispatch(
      id,
      new Address('address'),
      passenger,
      null,
      DispatchStatus.IDLE,
      null,
      null,
      null,
      new Date(),
      0,
    );
    dispatchWithWaiting = new Dispatch(
      id,
      new Address('address'),
      passenger,
      null,
      DispatchStatus.WAITING,
      new Date(),
      null,
      null,
      new Date(),
      0,
    );
    dispatchWithMatched = new Dispatch(
      id,
      new Address('address'),
      passenger,
      driver,
      DispatchStatus.MATCHED,
      new Date(),
      null,
      new Date(),
      new Date(),
      0,
    );
    dispatchWithCanceled = new Dispatch(
      id,
      new Address('address'),
      passenger,
      null,
      DispatchStatus.CANCELED,
      new Date(),
      new Date(),
      null,
      new Date(),
      0,
    );
  });

  afterAll(() => {
    clear();
  });

  describe('.matchBy()', () => {
    it('should throw exception when status is not waiting', () => {
      expect.assertions(1);

      try {
        dispatchWithIdle.matchBy(driver);
      } catch (e) {
        expect(e.message).toEqual(
          new UnprocessableEntityException('Status is not waiting').message,
        );
      }
    });
    it('should change status, matchedAt, driver when status is waiting', () => {
      dispatchWithWaiting.matchBy(driver);

      expect(dispatchWithWaiting).toEqual(dispatchWithMatched);
    });
  });

  describe('.cancelBy()', () => {
    it('should throw exception when passenger is different', () => {
      expect.assertions(1);

      try {
        dispatchWithWaiting.cancelBy(
          new Passenger('other passenger id', 'other passenger email'),
        );
      } catch (e) {
        expect(e.message).toEqual(new ForbiddenException().message);
      }
    });
    it('should throw exception when status is not waiting', () => {
      expect.assertions(1);

      try {
        dispatchWithIdle.cancelBy(passenger);
      } catch (e) {
        expect(e.message).toEqual(
          new UnprocessableEntityException('Status is not waiting').message,
        );
      }
    });

    it('should change status, canceledAt when status is waiting', () => {
      dispatchWithWaiting.cancelBy(passenger);
      expect(dispatchWithWaiting).toEqual(dispatchWithCanceled);
    });
  });

  describe('.requestBy()', () => {
    it('should throw exception when passenger is different', () => {
      expect.assertions(1);

      try {
        dispatchWithIdle.requestBy(
          new Passenger('other passenger id', 'other passenger email'),
        );
      } catch (e) {
        expect(e.message).toEqual(new ForbiddenException().message);
      }
    });
    it('should throw exception when status is not idle', () => {
      expect.assertions(1);

      try {
        dispatchWithWaiting.requestBy(passenger);
      } catch (e) {
        expect(e.message).toEqual(
          new UnprocessableEntityException('Status is not idle').message,
        );
      }
    });
    it('should change status, requestedAt when status is idle', () => {
      dispatchWithIdle.requestBy(passenger);
      expect(dispatchWithWaiting).toEqual(dispatchWithWaiting);
    });
  });
});
