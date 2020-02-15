
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const clearError = () => ({
  type: CLEAR_ERROR,
});
export const RENDER_NOTIFICATION = 'RENDER_NOTIFICATION';
export const renderNotification = (notification) => ({
  type: RENDER_NOTIFICATION,
  notification,
});
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const clearNotification = () => ({
  type: CLEAR_NOTIFICATION,
});
export const DISPLAY_ERROR = 'DISPLAY_ERROR';
export const displayError = (error) => ({
  type: DISPLAY_ERROR,
  error,
});
