// Dummy toast hook - toasts have been disabled
export function useToast() {
  return {
    toast: () => {},
    toasts: [],
    dismiss: () => {},
  };
}

export const toast = () => {};
