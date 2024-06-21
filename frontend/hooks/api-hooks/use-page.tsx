'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux-hooks';
import {
  addPages,
  addPage,
  editPage,
  removePage,
  setEditingPage,
  toggleCreatePageDialog,
} from '@/store/slice/pageSlice';
import { IPageMain, IPageMenuItem } from '@/types/componentInterfaces';
import {
  useGetPagesQuery,
  useCreatePageMutation,
  useEditPageMutation,
  useDeletePageMutation,
} from '@/api/pageApi';
import { toKebabCase } from '@/utils/helper';
import { Page } from '@/types/backendResponseInterfaces';
import { IPageRequest } from '@/types/requestInterfaces';
import { useNotification } from '@/components/hoc/notification-provider';
import { routes, systemMenuItems } from '@/components/hoc/layout/menu-items';

const usePage = () => {
  const {
    data: pagesData,
    isError: hasPageFetchError,
    isSuccess: isPageFetchSuccess,
    isLoading: isPageFetchLoading,
  } = useGetPagesQuery();
  const { notify } = useNotification();
  const [
    createPage,
    {
      isError: hasCreatePageError,
      isSuccess: isCreatePageSuccess,
      isLoading: isCreatePageLoading,
    },
  ] = useCreatePageMutation();
  const [
    editPage,
    {
      isError: hasEditPageError,
      isSuccess: isEditPageSuccess,
      isLoading: isEditPageLoading,
    },
  ] = useEditPageMutation();
  const [
    deletePage,
    {
      isError: hasDeletePageError,
      isSuccess: isDeletePageSuccess,
      isLoading: isDeletePageLoading,
    },
  ] = useDeletePageMutation();

  const dispatch = useAppDispatch();
  const pages = useAppSelector((state) => state.page.pages);
  const editingPage = useAppSelector((state) => state.page.editingPage);
  const [menuItems, setMenuItems] = useState<IPageMenuItem[]>([]);
  const [allAppRoutes, setAllAppRoutes] = useState<IPageMenuItem[]>([]);

  useEffect(() => {
    if (pagesData && pagesData.data) {
      const normalizedPages: IPageMain[] = pagesData?.data.Pages.map(
        (page: Page) => ({
          pageId: page.PG_ID,
          pageName: page.PG_Name,
          pagePermission: page.PG_Permission.map((permission) =>
            String(permission)
          ),
          pageType: String(page.PG_Type),
          isHidden: false,
          href: `/${toKebabCase(page.PG_Name)}`,
        })
      );
      const allRoutes = [...routes, ...normalizedPages];
      const combinedMenuItems = [...systemMenuItems, ...normalizedPages];
      setMenuItems(combinedMenuItems);
      setAllAppRoutes(allRoutes);
      dispatch(addPages(normalizedPages));
    }
  }, [pagesData]);

  const submitCreatedPage = async (page: IPageMain) => {
    try {
      const createPageRequest: IPageRequest = {
        PG_Name: page.pageName,
        PG_Permission: page.pagePermission.map((permission) =>
          Number(permission)
        ),
        PG_Type: Number(page.pageType),
      };
      const response = await createPage(createPageRequest).unwrap();
      notify(
        'Success',
        response.message || 'The page has been successfully created.',
        'success'
      );
      handleToggleCreateFormDialog();
    } catch (error: any) {
      console.log(error, 'error');
      notify(
        'Error',
        error?.data?.message ||
          error?.data?.detail ||
          'Failed to create the page. Please try again later.',
        'error'
      );
    }
  };

  const submitEditedPage = async (pageId: string, page: IPageMain) => {
    try {
      const editPageRequest: IPageRequest = {
        PG_Name: page.pageName,
        PG_Permission: page.pagePermission.map((permission) =>
          Number(permission)
        ),
      };
      const response = await editPage({
        PG_ID: pageId,
        PG_Name: editPageRequest.PG_Name,
        PG_Permission: editPageRequest.PG_Permission,
      }).unwrap();
      notify(
        'Success',
        response.message || 'The page has been updated successfully.',
        'success'
      );
      handleToggleCreateFormDialog();
    } catch (error: any) {
      console.log(error, 'error');
      notify(
        'Error',
        error.message || 'Failed to update the page. Please try again later.',
        'error'
      );
    }
    // handleToggleCreateFormDialog();
  };

  const handleEditButtonClick = async (page: IPageMain) => {
    handleToggleCreateFormDialog();
    dispatch(setEditingPage(page));
    console.log(page, editingPage, 'EDITING PAGE');
  };

  const handleRemovePage = async (page: IPageMain) => {
    try {
      const response = await deletePage(page.pageId).unwrap();
      console.log(response, 'RESPONSE');
      notify(
        'Success',
        response.message || 'The page has been successfully deleted.',
        'success'
      );
    } catch (error: any) {
      console.log(error, 'error');
      notify(
        'Error',
        error.message || 'Failed to delete the page. Please try again later.',
        'error'
      );
    }
  };

  const handleToggleCreateFormDialog = () => {
    dispatch(toggleCreatePageDialog());
    dispatch(setEditingPage(null));
  };

  return {
    isEditPageLoading,
    isEditPageSuccess,
    isDeletePageLoading,
    isDeletePageSuccess,
    isCreatePageSuccess,
    isCreatePageLoading,
    submitCreatedPage,
    submitEditedPage,
    pages,
    handleToggleCreateFormDialog,
    handleEditButtonClick,
    editingPage,
    handleRemovePage,
    menuItems,
    allAppRoutes,
  };
};

export default usePage;
