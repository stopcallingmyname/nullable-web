import { assertInInjectionContext, inject, Injector } from '@angular/core';

export function assertInjectorFn(fn: Function, injector?: Injector): Injector {
  // we only call assertInInjectionContext if there is no custom injector
  !injector && assertInInjectionContext(fn);
  // we return the custom injector OR try get the default Injector
  return injector ?? inject(Injector);
}
