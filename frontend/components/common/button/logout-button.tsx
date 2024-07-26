import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { closeDrawer } from '@/store/slice/layoutSlice';
import AppButton from './app-button';
import { useAppDispatch } from '@/hooks/redux-hooks';
import { Button } from '@/components/ui/button';
import {
  destructiveSolidButtonStyles,
  outlinedButtonStyles,
} from '@/styles/globals';
import useLogout from '@/hooks/api-hooks/use-logout';

interface ILogoutProps {
  trigger: React.ReactNode;
}

const LogoutButton: React.FC<ILogoutProps> = ({ trigger }) => {
  const dispatch = useAppDispatch();
  const { sendLogoutRequest } = useLogout();

  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader className="flex flex-col items-center space-y-4">
          {/* <LogOutIcon className="h-16 w-16 text-red-500" /> */}
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Are You Sure?
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Logging out will end your current session. You will need to log in
            again to resume.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between w-full gap-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <AppButton
            buttonText="Logout"
            onClick={() => sendLogoutRequest(handleCloseDrawer)}
            classNames={destructiveSolidButtonStyles}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutButton;
