'use client';
import React, { useEffect } from 'react';
import { FloatButton } from 'antd';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageContentImageSchema } from '../../utils/formSchema';
import FormField from './form-field';
import usePageContent from '../../hooks/api-hooks/use-page-content';
import { IPageContentImage } from '../../types/componentInterfaces';
import AppButton from './button/app-button';
import { Clipboard } from 'lucide-react';
import { primarySolidButtonStyles } from '../../styles/globals';
import { copyToClipboard } from '../../utils/helper';
import { useNotification } from '../hoc/notification-provider';
import LoadingButton from './button/loading-button';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { setPageContentImageURL } from '../../store/slice/pageSlice';
import { UploadOutlined } from '@ant-design/icons';
// import { ToolbarButton } from '@/components/plate-ui/t';

const UploadPageContentImage = () => {
  const dispatch = useAppDispatch();
  const { submitUploadPageContentImage, isUploadPageContentImageLoading } =
    usePageContent();
  const pageContentImageURL = useAppSelector(
    (state) => state.page.pageContentImageURL
  );
  const { notify } = useNotification();
  const form = useForm({
    resolver: zodResolver(pageContentImageSchema),
    defaultValues: {
      pageContentImage: undefined,
      pageContentImageURL: pageContentImageURL,
    },
  });
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;
  const upload = pageContentImageURL.length < 1;

  const onSubmit = async (data: any) => {
    let pageContentImage: IPageContentImage = {
      pageContentImage: data.pageContentImage,
    };

    await submitUploadPageContentImage(pageContentImage);
  };

  const resetForm = () => {
    form.reset();
    dispatch(setPageContentImageURL(''));
  };

  useEffect(() => {
    form.setValue('pageContentImageURL', pageContentImageURL as never);
  }, [pageContentImageURL, form]);

  const copyTextToClipBoard = () => {
    copyToClipboard(pageContentImageURL, notify);
  };

  if (!canEdit) {
    return <></>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent text-black px-3 py-0 hover:bg-muted hover:text-muted-foreground aria-checked:bg-accent aria-checked:text-accent-foreground">
          <UploadOutlined />
        </Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{upload ? 'Upload' : 'Copy'} Image</DialogTitle>
          <DialogDescription>
            {upload
              ? ' Upload page content image,then copy the URL.'
              : 'Copy the URL. Click the clear button to upload another.'}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {upload ? (
                <FormField
                  control={form.control}
                  name="pageContentImage"
                  label="Page Content Image"
                  placeholder="Select display Image"
                  type="picture"
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="pageContentImageURL"
                    label="Page Content Image URL"
                    placeholder=""
                  />
                </>
              )}

              <DialogFooter>
                {upload ? (
                  <LoadingButton
                    loading={isUploadPageContentImageLoading}
                    buttonText="Submit"
                  />
                ) : (
                  <div className="mt-6 flex flex-col sm:flex-row sm:justify-between w-full gap-4">
                    <AppButton
                      onClick={resetForm}
                      variant={'secondary'}
                      buttonText="Clear"
                    />
                    <DialogClose>
                      <Button
                        onClick={copyTextToClipBoard}
                        className={`${primarySolidButtonStyles}`}
                      >
                        <Clipboard className="mr-2 h-4 w-4" /> Copy
                      </Button>
                    </DialogClose>
                  </div>
                )}
              </DialogFooter>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPageContentImage;
