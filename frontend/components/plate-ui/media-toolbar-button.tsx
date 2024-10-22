import React from 'react';

import { withRef } from '@udecode/cn';
import {
  type ELEMENT_IMAGE,
  type ELEMENT_MEDIA_EMBED,
  useMediaToolbarButton,
} from '@udecode/plate-media';

import { ToolbarButton } from './toolbar';
import { Icons } from '../icons';

export const MediaToolbarButton = withRef<
  typeof ToolbarButton,
  {
    nodeType?: typeof ELEMENT_IMAGE | typeof ELEMENT_MEDIA_EMBED;
  }
>(({ nodeType, ...rest }, ref) => {
  const { props } = useMediaToolbarButton({ nodeType });

  return (
    <ToolbarButton ref={ref} {...props} {...rest}>
      <Icons.image />
    </ToolbarButton>
  );
});
