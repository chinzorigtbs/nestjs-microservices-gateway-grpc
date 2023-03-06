/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "health";

export interface HealthCheckRequest {
  service: string;
}

export interface HealthCheckResponse {
  status: HealthCheckResponse_ServingStatus;
}

export enum HealthCheckResponse_ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  DOWN = 2,
  UNRECOGNIZED = -1,
}

export const HEALTH_PACKAGE_NAME = "health";

export interface HealthClient {
  check(request: HealthCheckRequest): Observable<HealthCheckResponse>;
}

export interface HealthController {
  check(
    request: HealthCheckRequest,
  ): Promise<HealthCheckResponse> | Observable<HealthCheckResponse> | HealthCheckResponse;
}

export function HealthControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["check"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Health", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Health", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HEALTH_SERVICE_NAME = "Health";
