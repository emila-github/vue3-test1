import { ref } from 'vue'

export function useEventLogger() {
  const logs = ref<string[]>([])

  function log(event: string) {
    logs.value.push(`[${new Date().toLocaleTimeString()}] ${event}`)
  }

  return { logs, log }
}
