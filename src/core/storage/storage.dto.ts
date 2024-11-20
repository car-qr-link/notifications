import { notification } from '@car-qr-link/apis';

export const FIELD_NOTIFICATION = 'notification';
export const FIELD_ANSWER = 'answer';

export interface Notification {
  notification: notification.Notification;
  answer?: notification.Answer;
}
