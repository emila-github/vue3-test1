import { ref, computed } from 'vue'
import { useEventLogger } from './useEventLogger'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const double = computed(() => count.value * 2)

  // 复用另一个组合式函数
  const { logs, log } = useEventLogger()

  function increment() {
    count.value++
    log(`increment → ${count.value}`)
  }

  function decrement() {
    count.value--
    log(`decrement → ${count.value}`)
  }

  return { count, double, increment, decrement, logs }
}
