export interface Alert {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  id: number;
}