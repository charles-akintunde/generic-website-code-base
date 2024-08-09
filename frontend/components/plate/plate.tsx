'use client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TooltipProvider } from '@/components/plate-ui/tooltip';
import { CommentsProvider } from '@udecode/plate-comments';
import { Plate, TElement } from '@udecode/plate-common';
import { plugins } from '@/components/plate/plate-config';
import { Editor } from '@/components/plate-ui/editor';
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons';
import { CommentsPopover } from '@/components/plate-ui/comments-popover';
import useUserLogin from '@/hooks/api-hooks/use-user-login';
import { useAppSelector } from '@/hooks/redux-hooks';

type PlateEditorProps = {
  value: TElement[];
  onChange: (value: Array<TElement>) => void;
};

export const PlateEditor: React.FC<PlateEditorProps> = ({
  value,
  onChange,
}) => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const canEdit = uiActiveUser ? uiActiveUser.uiCanEdit : false;

  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <CommentsProvider users={{}} myUserId="1">
          <Plate plugins={plugins} initialValue={value} onChange={onChange}>
            {canEdit && (
              <FixedToolbar>
                <FixedToolbarButtons />
              </FixedToolbar>
            )}

            <Editor />

            {canEdit && (
              <>
                <FloatingToolbar>
                  <FloatingToolbarButtons />
                </FloatingToolbar>
                <CommentsPopover />
              </>
            )}
          </Plate>
        </CommentsProvider>
      </DndProvider>
    </TooltipProvider>
  );
};
