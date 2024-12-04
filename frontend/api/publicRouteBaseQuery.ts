import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';
import { setUIActiveUser } from '../store/slice/userSlice';
import { EUserRole } from '../types/enums';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include',
});

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const metadataCookie = Cookies.get('access_token_metadata');
  let metadata = null;

  if (metadataCookie) {
    try {
      let sanitizedValue = metadataCookie.replace(/\\/g, ''); 
      if (sanitizedValue.startsWith('"') && sanitizedValue.endsWith('"')) {
        sanitizedValue = sanitizedValue.slice(1, -1); 
      }

      metadata = JSON.parse(sanitizedValue); 
      const currentTime = Math.floor(Date.now() / 1000); 

      if (metadata.exp < currentTime) {
        console.log('Token expired. Logging out...');

        Cookies.remove('access_token_metadata');
        
        api.dispatch(
          setUIActiveUser({
            uiId: null,
            uiFullName: '',
            uiUniqueURL: '',
            uiInitials: '',
            uiIsAdmin: false,
            uiIsLoading: false,
            uiIsSuperAdmin: false,
            uiCanEdit: false,
            uiRole: [EUserRole.Public],
            uiPhotoURL: null,
          })
        );

        return {
          error: {
            status: 401,
            data: { message: 'Session expired. Please log in again.' },
          },
        };
      }
    } catch (error) {
      console.error('Invalid cookie value:', error);

      
      Cookies.remove('access_token_metadata');

      api.dispatch(
        setUIActiveUser({
          uiId: null,
          uiFullName: '',
          uiInitials: '',
          uiUniqueURL: '',
          uiIsAdmin: false,
          uiIsLoading: false,
          uiIsSuperAdmin: false,
          uiCanEdit: false,
          uiRole: [EUserRole.Public],
          uiPhotoURL: null,
        })
      );

      // Return a 400 error for invalid session metadata
      return {
        error: {
          status: 400,
          data: { message: 'Invalid session metadata. Please log in again.' },
        },
      };
    }
  }

  // Proceed with the API request if no issues with metadata
  let result = await baseQuery(args, api, extraOptions);

  // Handle generic errors (e.g., clear caches on error)
  if (result.error) {
    api.dispatch({ type: 'api/clearAllCaches' });
  }

  return result;
};

export default customBaseQuery;
