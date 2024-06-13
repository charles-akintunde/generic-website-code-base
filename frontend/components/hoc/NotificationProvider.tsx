import React, { PropsWithChildren, createContext, useContext } from 'react';
import { notification, Modal } from 'antd';
import { NotificationPlacement } from 'antd/lib/notification/interface';
import {
  INotificationContextProps,
  NotificationType,
} from '@/types/componentInterfaces';

const NotificationContext = createContext<
  INotificationContextProps | undefined
>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

export const NotificationProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const notify = (
    message: string,
    description = '',
    type: NotificationType = 'info',
    placement: NotificationPlacement = 'topRight'
  ) => {
    notification[type]({
      message,
      description,
      placement,
    });
  };

  const notifyWithAction = (
    message: string,
    description: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    Modal.confirm({
      title: message,
      content: description,
      onOk: onConfirm,
      onCancel,
    });
  };

  return (
    <NotificationContext.Provider value={{ notify, notifyWithAction }}>
      {children}
    </NotificationContext.Provider>
  );
};
