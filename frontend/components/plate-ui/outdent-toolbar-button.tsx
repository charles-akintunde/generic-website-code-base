import React from 'react';

import { withRef } from '@udecode/cn';
import { useOutdentButton } from '@udecode/plate-indent';

import { ToolbarButton } from './toolbar';
import { Icons } from '../icons';

export const OutdentToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const { props } = useOutdentButton();

    return (
      <ToolbarButton ref={ref} tooltip="Outdent" {...props} {...rest}>
        <Icons.outdent />
      </ToolbarButton>
    );
  }
);
