import toast from 'react-hot-toast'

type ToastOpts = Parameters<typeof toast>[1]

export const showToast = {
  success: (msg: string, opts?: ToastOpts) => toast.success(msg, opts),
  error: (msg: string, opts?: ToastOpts) => toast.error(msg, opts),
  loading: (msg: string, opts?: ToastOpts) => toast.loading(msg, opts),

  fromError: (err: unknown, fallback = "Something went wrong", opts?: ToastOpts) => {
    const msg =
      (err as any)?.response?.data?.error?.message ||
      (err as any)?.error?.message ||
      (err as any)?.message ||
      fallback
    return toast.error(msg, opts)
  }
}
