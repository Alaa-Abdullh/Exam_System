import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  show(notification: Notification) {
    this.notificationSubject.next(notification);
    
    if (notification.duration) {
      setTimeout(() => {
        this.clear();
      }, notification.duration);
    }
  }

  success(message: string, duration: number = 3000) {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration: number = 5000) {
    this.show({ type: 'error', message, duration });
  }

  info(message: string, duration: number = 3000) {
    this.show({ type: 'info', message, duration });
  }

  warning(message: string, duration: number = 4000) {
    this.show({ type: 'warning', message, duration });
  }

  clear() {
    this.notificationSubject.next({ type: 'info', message: '' });
  }
} 