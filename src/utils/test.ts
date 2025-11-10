import type { VueWrapper } from '@vue/test-utils'

export function waitForEvent(wrapper: VueWrapper, event: string) {
  return new Promise<void>((resolve) => {
    function handleTimeout() {
      if (wrapper.emitted(event)) {
        return resolve()
      }

      setTimeout(handleTimeout, 100)
    }

    handleTimeout()
  })
}
