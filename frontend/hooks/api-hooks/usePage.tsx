'use client';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../reduxHooks';
import { addPage } from '@/store/slice/pageSlice';
import { IPageMain } from '@/types/componentInterfaces';
import { RootState } from '@reduxjs/toolkit/query';

const usePage = () => {
  const dispatch = useAppDispatch();
  const pages = useAppSelector((state) => state.page.pages);

  const submitCreatedPage = (page: IPageMain) => {
    dispatch(addPage(page));
  };

  return { submitCreatedPage, pages }; // Explicitly return the object
};

export default usePage;
