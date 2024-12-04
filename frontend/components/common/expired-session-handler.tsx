import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUIActiveUser } from '../../store/slice/userSlice';
import { EUserRole } from '../../types/enums';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';


type ExpiredSessionHandlerProps = {
  isActiveUserFetchLoading: boolean;
};

const ExpiredSessionHandler: React.FC<ExpiredSessionHandlerProps> = ({ isActiveUserFetchLoading }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const metadataCookie = Cookies.get('access_token_metadata');

      if (metadataCookie) {
        try {
          let sanitizedValue = metadataCookie.replace(/\\/g, '');
          if (sanitizedValue.startsWith('"') && sanitizedValue.endsWith('"')) {
            sanitizedValue = sanitizedValue.slice(1, -1);
          }
          const metadata = JSON.parse(sanitizedValue);

          const currentTime = Math.floor(Date.now() / 1000);

          if (metadata.exp < currentTime) {
            Cookies.remove('access_token_metadata');

            dispatch(
              setUIActiveUser({
                uiId: null,
                uiFullName: '',
                uiInitials: '',
                uiUniqueURL: '',
                uiIsAdmin: false,
                uiIsLoading: isActiveUserFetchLoading,
                uiIsSuperAdmin: false,
                uiCanEdit: false,
                uiRole: [EUserRole.Public],
                uiPhotoURL: null,
              })
            );

            router.replace('/'); 
            setTimeout(() => {
              setIsModalVisible(true); 
            }, 100); 
          }
        } catch (error) {
          console.error('Error parsing metadata cookie:', error);
          Cookies.remove('access_token_metadata'); 
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, isActiveUserFetchLoading, router]);


  const handleDialogOk = () => {
    setIsModalVisible(false);
    router.replace('/sign-in'); 
  };

  const handleDialogCancel = () => {
    setIsModalVisible(false); 
  };

  return (
    <>
    <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
        </DialogHeader>
        <p>Your session has expired. Please log in again to continue.</p>
        <DialogFooter>
          <Button onClick={handleDialogOk}>Log In Again</Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleDialogCancel}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
};

export default ExpiredSessionHandler;