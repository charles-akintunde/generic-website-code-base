import React from 'react';

import { withRef } from '@udecode/cn';
import { useIndentButton } from '@udecode/plate-indent';

import { ToolbarButton } from './toolbar';
import { Icons } from '../icons';

export const IndentToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const { props } = useIndentButton();

    return (
      <ToolbarButton ref={ref} tooltip="Indent" {...props} {...rest}>
        <Icons.indent />
      </ToolbarButton>
    );
  }
);
