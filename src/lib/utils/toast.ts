// Simple toast notification utility
export const toast = {
  success: (message: string) => {
    console.log('✓ Success:', message);
    // You can integrate with a toast library here like react-hot-toast, sonner, etc.
  },
  error: (message: string) => {
    console.error('✗ Error:', message);
    // You can integrate with a toast library here like react-hot-toast, sonner, etc.
  },
  info: (message: string) => {
    console.info('ℹ Info:', message);
  },
  warning: (message: string) => {
    console.warn('⚠ Warning:', message);
  },
};
