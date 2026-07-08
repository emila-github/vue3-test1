import { ref, reactive } from 'vue'

interface UseFormModalOptions<T> {
  initialForm: T
  onSubmit?: (form: T, isEdit: boolean) => void | Promise<void>
}

export function useFormModal<T extends Record<string, any>>(options: UseFormModalOptions<T>) {
  const open = ref(false)
  const isEdit = ref(false)
  const form = reactive({ ...options.initialForm }) as T

  function openCreate() {
    isEdit.value = false
    Object.assign(form, options.initialForm)
    open.value = true
  }

  function openEdit(data: T) {
    isEdit.value = true
    Object.assign(form, data)
    open.value = true
  }

  function handleSubmit() {
    options.onSubmit?.({ ...form }, isEdit.value)
    open.value = false
  }

  function handleCancel() {
    open.value = false
  }

  return {
    open,
    isEdit,
    form,
    openCreate,
    openEdit,
    handleSubmit,
    handleCancel,
  }
}
