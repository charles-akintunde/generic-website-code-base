import store from '@/store';
import { NotificationPlacement } from 'antd/lib/notification/interface';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type MenuItemProps = {
  menuItem: string;
  href: string;
  display: boolean;
};

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface IMenuItem {
  id: string;
  // name: string;
  // href: string;
}

export interface INotificationContextProps {
  notify: (
    message: string,
    description?: string,
    type?: NotificationType,
    placement?: NotificationPlacement
  ) => void;
  notifyWithAction: (
    message: string,
    description: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}
