import { getCurrentInstance, inject, type App, type InjectionKey } from 'vue'

interface DisposableService {
  dispose?: () => void
}

type FallbackContext = object

const fallbackServices = new WeakMap<FallbackContext, Map<symbol, unknown>>()
const cleanupRegistered = new WeakSet<FallbackContext>()

/** Resolve an injected service, or create one scoped to the current Vue app context. */
export function useMcService<T>(key: InjectionKey<T>, create: () => T): T {
  const instance = getCurrentInstance()
  if (!instance) return create()

  const provided = inject(key, null)
  if (provided) return provided

  const context = instance.appContext as FallbackContext
  let services = fallbackServices.get(context)
  if (!services) {
    services = new Map()
    fallbackServices.set(context, services)
  }

  const serviceKey = key as symbol
  let service = services.get(serviceKey) as T | undefined
  if (!service) {
    service = create()
    services.set(serviceKey, service)
  }

  if (!cleanupRegistered.has(context)) {
    cleanupRegistered.add(context)
    const app = (instance.appContext as typeof instance.appContext & { app?: App }).app
    if (app) {
      app.onUnmount(() => {
        for (const fallback of services.values()) {
          ;(fallback as DisposableService).dispose?.()
        }
        services.clear()
        cleanupRegistered.delete(context)
      })
    }
  }

  return service
}
