import React from 'react';
import { useAppDispatch } from '../redux-hooks';
import { pageContentApi } from '@/api/pageContentApi';

const useHelper = () => {
  const dispatch = useAppDispatch();

  const clearCache = () => {
    dispatch(pageContentApi.util.resetApiState());
  };

  return { clearCache };
};

export default useHelper;
