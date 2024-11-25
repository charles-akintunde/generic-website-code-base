'use client';
import { Plate, TElement } from '@udecode/plate-common';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppSelector } from '../../hooks/redux-hooks';
import { TooltipProvider } from '../plate-ui/tooltip';
import { CommentsProvider } from '@udecode/plate-comments';
import { FixedToolbar } from '../plate-ui/fixed-toolbar';
import { FloatingToolbar } from '../plate-ui/floating-toolbar';
import { FixedToolbarButtons } from '../plate-ui/fixed-toolbar-buttons';
import { FloatingToolbarButtons } from '../plate-ui/floating-toolbar-buttons';
import { CommentsPopover } from '../plate-ui/comments-popover';
import { plugins } from './plate-config';
import { Editor } from '../plate-ui/editor';

type PlateEditorProps = {
  value: TElement[];
  onChange: (value: Array<TElement>) => void;
};

export const PlateEditor: React.FC<PlateEditorProps> = ({
  value,
  onChange,
}) => {
  const uiActiveUser = useAppSelector((state) => state.userSlice.uiActiveUser);
  const uiActiveUserProfileEdit = useAppSelector(
    (state) => state.userSlice.uiActiveUserProfileEdit
  );
  let isAdmin = uiActiveUser ? uiActiveUser.uiCanEdit : false;

    
    const uiEditorInProfileMode = uiActiveUserProfileEdit.uiEditorInProfileMode;
    const uiIsUserEditingMode = uiActiveUserProfileEdit.uiIsUserEditingMode;
    const uiIsPageContentEditingMode = uiActiveUserProfileEdit.uiIsPageContentEditingMode;
    const uiIsAdminInEditingMode = uiActiveUserProfileEdit.uiIsAdminInEditingMode;
  
    let canEdit = false;
  
    if (uiEditorInProfileMode) {
      canEdit = uiIsUserEditingMode;
    } else if (uiIsPageContentEditingMode || uiIsAdminInEditingMode) {
      canEdit = isAdmin && uiIsAdminInEditingMode;
    }
  

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
