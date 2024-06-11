import store from '@/store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type MenuItemProps = {
  menuItem: string;
  href: string;
  display: boolean;
};
