import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUIActiveUser } from '../../store/slice/userSlice';
import { EUserRole } from '../../types/enums';
import { useNotification } from '../hoc/notification-provider';
import { useRouter } from 'next/navigation';

type ExpiredSessionHandlerProps = {
  isActiveUserFetchLoading: boolean;
};

const ExpiredSessionHandler: React.FC<ExpiredSessionHandlerProps> = ({ isActiveUserFetchLoading }) => {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const router = useRouter();

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

            notify('Error', 'Your session has expired. Please log in again.', 'error');

            dispatch(
              setUIActiveUser({
                uiId: null,
                uiFullName: '',
                uiInitials: '',
                uiIsAdmin: false,
                uiIsLoading: isActiveUserFetchLoading,
                uiIsSuperAdmin: false,
                uiCanEdit: false,
                uiRole: [EUserRole.Public],
                uiPhotoURL: null,
              })
            );

          
            

          }
        } catch (error) {
          console.error('Error parsing metadata cookie:', error);
          Cookies.remove('access_token_metadata'); 
        }
      }
    }, 5000);

    return () => clearInterval(interval); 
  }, [dispatch, notify, isActiveUserFetchLoading]);

  return null; 
};

export default ExpiredSessionHandler;
