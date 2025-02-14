import React, { useEffect } from 'react';

import type { PlateContentProps } from '@udecode/plate-common';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@udecode/cn';
import { PlateContent } from '@udecode/plate-common';
import { cva } from 'class-variance-authority';
import { useAppSelector } from '../../hooks/redux-hooks';

const editorVariants = cva(
  cn(
    'relative overflow-x-auto whitespace-pre-wrap break-words',
    'min-h-[80px] w-full rounded-md bg-background px-6 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none',
    '[&_[data-slate-placeholder]]:text-muted-foreground [&_[data-slate-placeholder]]:!opacity-100',
    '[&_[data-slate-placeholder]]:top-[auto_!important]',
    '[&_strong]:font-bold'
  ),
  {
    defaultVariants: {
      focusRing: true,
      size: 'sm',
      variant: 'outline',
    },
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
      focusRing: {
        false: '',
        true: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      },
      focused: {
        true: 'ring-2 ring-ring ring-offset-2',
      },
      size: {
        md: 'text-base',
        sm: 'text-sm',
      },
      variant: {
        ghost: '',
        outline: 'border border-input',
      },
    },
  }
);

export type EditorProps = PlateContentProps &
  VariantProps<typeof editorVariants>;

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  (
    {
      className,
      disabled,
      focusRing,
      focused,
      readOnly,
      size,
      variant,
      ...props
    },
    ref
  ) => {
    const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
    const activeUserProfileEdit = useAppSelector((state) => state.userSlice.uiActiveUserProfileEdit);
    const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;

    const {
      uiEditorInProfileMode,
      uiIsUserEditingMode,
      uiIsAdminInEditingMode,
      uiIsPageContentEditingMode,
    } = activeUserProfileEdit;

    let finalReadOnly = true;
    let finalDisabled = true;
    let finalFocused = false;
    let canEditClassName = 'border-none';

    if (uiEditorInProfileMode) {
      finalReadOnly = !uiIsUserEditingMode; 
      finalDisabled = !uiIsUserEditingMode;
      finalFocused = uiIsUserEditingMode;
      canEditClassName = uiIsUserEditingMode ? '' : 'border-none';
    } else if (uiIsPageContentEditingMode ) {

      if (canEdit) {
        finalReadOnly = !uiIsAdminInEditingMode;
        finalDisabled = !uiIsAdminInEditingMode;
        finalFocused = uiIsAdminInEditingMode;
        canEditClassName = uiIsAdminInEditingMode ? '' : 'border-none';
      } else {

        finalReadOnly = true;
        finalDisabled = true;
        finalFocused = false;
        canEditClassName = 'border-none';
      }
    }


    return (
      <div className="relative w-full" ref={ref}>
        <PlateContent
          aria-disabled={finalDisabled}
          className={cn(
            editorVariants({
              disabled,
              focusRing,
              focused: finalFocused,
              size,
              variant,
            }),
            canEditClassName
          )}
          disableDefaultStyles
          readOnly={finalReadOnly}
          {...props}
        />
      </div>
    );
  }
);
Editor.displayName = 'Editor';

export { Editor };
