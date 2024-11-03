import React from 'react';
import { useAppDispatch } from '../redux-hooks';
import { pageContentApi } from '../../api/pageContentApi';
import { userApi } from '../../api/userApi';

const useHelper = () => {
  const dispatch = useAppDispatch();

  const clearCache = () => {
    dispatch(pageContentApi.util.resetApiState());
  };

  return { clearCache };
};

export default useHelper;
