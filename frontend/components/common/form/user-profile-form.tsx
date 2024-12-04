'use client';
import React, { useEffect, useState } from 'react';
import { Form } from '../../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  userProfileSchema,
  userRoleStatusSchema,
} from '../../../utils/formSchema';
import FormField from '../form-field';
import { getNames } from 'country-list';
import LoadingButton from '../button/loading-button';
import { IUserBase, IUserInfo } from '../../../types/componentInterfaces';
import { TElement } from '@udecode/plate-common';
import {
  getChangedFields,
  MEMBERPOSITION_OPTIONS,
  notifyNoChangesMade,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
} from '../../../utils/helper';
import { useNotification } from '../../hoc/notification-provider';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { sanitizeAndCompare } from '../../../utils/helper';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';

import {
  setUIIsUserEditingMode,
  toggleCreateUserDialog,
} from '../../../store/slice/userSlice';
import { EUserRole } from '../../../types/enums';
import { PlateEditor } from '../../plate/plate';
import { Divider, Switch } from 'antd';
import { removeNullValues } from '../../../utils/helper';
import { useUserInfo } from '../../../hooks/api-hooks/use-user-info';

interface UserProfileFormProps {
  userInfo: IUserInfo;
  isUserFetchLoading: boolean;
  setDialogOpen?: (open: boolean) => void;
}

type UserProfileFormData = z.infer<typeof userProfileSchema>;

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userInfo,
  isUserFetchLoading
}) => {
  const dispatch = useAppDispatch();
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const activeUserId = uiActiveUser.uiId;
  const countries = getNames();
  const { notify } = useNotification();
  const { submitEditUser } = useUserInfo();
  const [plateEditor, setPlateEditor] = useState<TElement[]>(
    userInfo && userInfo.uiAbout
      ? userInfo.uiAbout
      : [
          {
            id: '1',
            type: 'p',
            children: [{ text: 'Hello, World!' }],
          },
        ]
  );
  const [plateEditorKey, setPlateEditorKey] = useState<string>(
    JSON.stringify(plateEditor)
  );
  const [isSameUser, setIsSameUser] = useState(
    sanitizeAndCompare(activeUserId as string, userInfo?.id as string)
  );
  const handleModeChange = (checked: boolean) => {
    dispatch(
      setUIIsUserEditingMode({
        uiIsUserEditingMode: !uiIsUserEditingMode,
        uiEditorInProfileMode: true,
        uiIsAdminInEditingMode: false,
        uiIsPageContentEditingMode: false
        
      })
    );
  };

  const activeUserProfileEdit = useAppSelector(
    (state) => state.userSlice.uiActiveUserProfileEdit
  );
  const uiIsUserEditingMode = activeUserProfileEdit.uiIsUserEditingMode;

  let userInfoWithoutNull = removeNullValues(userInfo);
  delete userInfoWithoutNull.uiPhoto;

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userInfoWithoutNull || {
      uiFirstName: '',
      uiLastName: '',
      uiPhoto: undefined,
      uiCity: '',
      uiProvince: '',
      uiCountry: '',
      uiPostalCode: '',
      uiPhoneNumber: '',
      uiOrganization: '',
      uiPrefix: '',
      uiSuffix: ''
    },
  });

  useEffect(() => {
    sanitizeAndCompare(activeUserId as string, userInfo?.id as string);
    setIsSameUser(
      sanitizeAndCompare(activeUserId as string, userInfo?.id as string)
    );
    dispatch(
      setUIIsUserEditingMode({
        uiIsUserEditingMode: false,
        uiEditorInProfileMode: true,
        uiIsAdminInEditingMode: false,
        uiIsPageContentEditingMode: false
        

      })
    );
  }, []);

  useEffect(() => {
    if (userInfo) {
      form.reset(userInfo);
    }
  }, [userInfo, form]);

  const onSubmit = async (
    data: any,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const newDataWithContents = { ...data, uiAbout: plateEditor };
    const changedFields = getChangedFields(userInfo, newDataWithContents);

    if (Object.keys(changedFields).length > 0) {
      await submitEditUser(
        userInfo.id,
        changedFields as Partial<IUserInfo>,
        userInfo
      );
      form.reset();
    } else {
      notifyNoChangesMade(notify);
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 "
        // @ts-ignore
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {isSameUser && activeUserId && (
          <div className="flex justify-end">
            <Switch
              checkedChildren="Editing Mode"
              unCheckedChildren="Viewing Mode"
              checked={uiIsUserEditingMode}
              onChange={handleModeChange}
            />
          </div>
        )}

        {isSameUser && uiIsUserEditingMode && (
          <>
            <FormField
              control={form.control}
              name="uiFirstName"
              label="First Name"
              placeholder=""
            />
            <FormField
              control={form.control}
              name="uiLastName"
              label="Last Name"
              placeholder=""
            />
        <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="uiPrefix"
            label="Prefix"
            placeholder=""
          />
        </div>
        <div className="flex-1">
          <FormField
            control={form.control}
            name="uiSuffix"
            label="Suffix"
            placeholder=""
          />
        </div>
      </div>
            <FormField
              control={form.control}
              name="uiCountry"
              label="Country"
              placeholder="Select Your Country"
              type="select"
              options={countries.map((country: string) => ({
                value: country,
                label: country,
              }))}
            />
            <FormField
              control={form.control}
              name="uiCity"
              label="City"
              placeholder=""
            />
            <FormField
              control={form.control}
              name="uiProvince"
              label="Province"
              placeholder=""
            />
            <FormField
              control={form.control}
              name="uiPostalCode"
              label="Postal Code"
              placeholder=""
            />
            <FormField
              control={form.control}
              name="uiPhoneNumber"
              label="Phone Number"
              placeholder=""
            />
            <FormField
              control={form.control}
              name="uiOrganization"
              label="Organization"
              placeholder=""
            />
            <FormField
              type="picture"
              control={form.control}
              name="uiPhoto"
              label="Profile Picture"
              placeholder=""
            />
          </>
        )}
        <div className="mt-20">
          {isSameUser && uiIsUserEditingMode ? (
            <span className="font-semibold  mr-1 text-gray-700">About Me</span>
          ) : (
            <div>
              <p className="font-semibold text-lg text-gray-700">About Me</p>
              <Divider />
            </div>
          )}

          <PlateEditor
            key={plateEditorKey}
            value={plateEditor}
            onChange={(value) => {
              setPlateEditor(value);
            }}
          />
        </div>
        {/* {isSameUser && uiIsUserEditingMode && (
          <div className="fixed z-50 mt-20 bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
            <LoadingButton loading={false} buttonText={'Save changes'} />
          </div>
        )} */}

        {isSameUser && uiIsUserEditingMode && (
          <div
            className={`w-full sticky bg-white flex mx-auto bottom-0 z-40 h-20 shadow2xl`}
          >
            <LoadingButton
              className=""
              buttonText="Save Changes"
      loading={isUserFetchLoading}
            />
          </div>
        )}
      </form>
    </Form>
  );
};

// export const UserProfileDialog: React.FC<UserProfileFormProps> = ({
//   userInfo,
//   userProfileRefetch,
// }) => {
//   const [isDialogOpen, setDialogOpen] = useState(false);

//   const handleOpenChange = (open: boolean) => {
//     setDialogOpen(open);
//   };

//   return (
//     <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
//       <DialogTrigger asChild>
//         <Button
//           className={`space-x-2 items-center flex ${primarySolidButtonStyles} w-full`}
//           size="icon"
//         >
//           <EditOutlined className="h-4 w-4" />
//           <p className="hidden lg:block">Edit Profile</p>

//           {/* <EditOutlined className="h-4 w-4" /> */}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[90vh]">
//         <DialogHeader>
//           <DialogTitle>Edit profile</DialogTitle>
//           <DialogDescription>
//             Make changes to the profile here. Click save when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="py-4 ">
//           <ScrollArea className="max-h-[70vh] rounded-md border p-4">
//             <UserProfileForm
//               userProfileRefetch={userProfileRefetch}
//               userInfo={userInfo}
//               setDialogOpen={setDialogOpen}
//             />
//           </ScrollArea>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
const filterNullValues = (obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null)
  );
};


type UserRoleStatusFormData = z.infer<typeof userRoleStatusSchema>;

export const UserRoleStatusDialog = () => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const activeUserId = uiActiveUser.uiId;
  const { submitEditRoleStatus, isEditRoleAndStatusLoading } = useUserInfo();
  const dispatch = useAppDispatch();
  const isDialogOpen = useAppSelector((state) => state.userSlice.isDialogOpen);
  const userInfo = useAppSelector((state) => state.userSlice.editingUser);
  const uiIsSuperAdmin = uiActiveUser.uiIsSuperAdmin;
  const [isSameUser, setIsSameUser] = useState(
    sanitizeAndCompare(activeUserId as string, userInfo?.id as string)
  );
  const { notify } = useNotification();
  const sanitizedUserInfo = userInfo ? filterNullValues(userInfo) : null;
  const form = useForm<UserRoleStatusFormData>({
    resolver: zodResolver(userRoleStatusSchema),
    // @ts-ignore
    defaultValues: sanitizedUserInfo || {
      uiMainRoles: '',
      uiStatus: '',
      uiMemberPosition: '',
      uiIsUserAlumni: false,
    },
  });

  useEffect(() => {
    if (userInfo) {
      // @ts-ignore
      form.reset(userInfo);
    }
  }, [userInfo, form]);

  const onSubmit = async (data: any, event: { preventDefault: () => void }) => {
    event.preventDefault();
    const changedFields = getChangedFields(userInfo, data);
    if (userInfo && Object.keys(changedFields).length > 0) {
      await submitEditRoleStatus(
        userInfo.id,
        changedFields as Partial<IUserBase>,
        userInfo
      );
    } else {
      notifyNoChangesMade(notify);
      return;
    }
  };

  const { watch, setValue } = form;
  const currentFormData = watch(); // Returns an object with all current form values
  const uiRole = watch('uiMainRoles');
  const isUserAlumni = watch('uiIsUserAlumni');

  useEffect(() => {
    if (isUserAlumni) {
      setValue('uiMainRoles', EUserRole.Alumni);
    }else{
      setValue('uiMainRoles', EUserRole.User);
    }
  }, [isUserAlumni, setValue]);

  const handleOpenChange = () => {
    dispatch(toggleCreateUserDialog());
  };

  if (!uiIsSuperAdmin) {
    return <></>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="py-4 ">
          <Form {...form}>
            <form
              className="space-y-6 w-full h-full overflow-y-auto pb-20"
              // @ts-ignore
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {!isSameUser && (
                <>
                  <FormField
                    control={form.control}
                    name="uiStatus"
                    label="Status"
                    placeholder="User Status"
                    type="select"
                    options={STATUS_OPTIONS}
                  />

                  {!isUserAlumni && (
                    <FormField
                      control={form.control}
                      name="uiMainRoles"
                      label="Role"
                      placeholder="User Role"
                      type="select"
                      options={ROLE_OPTIONS}
                    />
                  )}

              {(uiRole &&
                    (uiRole.includes(EUserRole.SuperAdmin) ||
                      uiRole.includes(EUserRole.Admin) ||
                      uiRole.includes(EUserRole.Member))) ||
                  isUserAlumni ? (
                    <FormField
                      control={form.control}
                      name="uiMemberPosition"
                      label="Member Position"
                      placeholder="Select Member Position"
                      type="select"
                      options={MEMBERPOSITION_OPTIONS}
                    />
                  ) : null}

                  <FormField
                    control={form.control}
                    name="uiIsUserAlumni"
                    label="Is this User an Alumni"
                    placeholder=""
                    type="checkbox"
                  />

                  <div className="fixed z-30 mt-20 bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
                    <LoadingButton
                      loading={isEditRoleAndStatusLoading}
                      buttonText={'Save changes'}
                    />
                  </div>
                </>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
