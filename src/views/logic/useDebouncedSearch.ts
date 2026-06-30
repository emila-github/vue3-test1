import { ref, watch } from 'vue'

export function useDebouncedSearch(searchFn: (keyword: string) => Promise<string[]>, delay = 300) {
  const keyword = ref('')
  const results = ref<string[]>([])
  const loading = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  watch(keyword, (val) => {
    if (timer) clearTimeout(timer)

    if (!val.trim()) {
      results.value = []
      loading.value = false
      return
    }

    loading.value = true
    timer = setTimeout(async () => {
      results.value = await searchFn(val)
      loading.value = false
    }, delay)
  })

  return { keyword, results, loading }
}
