import toast from "react-hot-toast";

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      duration: 4000,
      className: "bg-blue-600 text-white",
    }),

  error: (message: string) =>
    toast.error(message, {
      duration: 4000,
      className: "bg-red-600 text-white",
    }),

  loading: (message: string) =>
    toast.loading(message, {
      className: "bg-blue-500 text-white",
    }),

  dismiss: (toastId?: string) => toast.dismiss(toastId),

  info: (message: string) =>
    toast(message, {
      duration: 4000,
      icon: "ℹ️",
      className: "bg-blue-700 text-white",
    }),
};
