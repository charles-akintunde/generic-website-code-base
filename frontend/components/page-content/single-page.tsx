import usePage from '@/hooks/api-hooks/use-page';
import { containerNoFlexPaddingStyles } from '@/styles/globals';
import { fromKebabCase } from '@/utils/helper';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { PlateEditor } from '../plate/plate';

const SinglePage = () => {
  const pathname = usePathname();
  const [pageName, setPageName] = useState(
    fromKebabCase(pathname.split('/')['1'])
  );
  const { currentPage, getCurrentPageContents } = usePage(pageName);
  console.log(currentPage, 'CCCCCCCC');
  const [plateEditor, setPlateEditor] = useState([
    {
      id: '1',
      type: 'p',
      children: [{ text: `Enter Content for ${pageName}` }],
    },
  ]);
  const [plateEditorKey, setPlateEditorKey] = useState<string>(
    JSON.stringify(plateEditor)
  );

  return (
    <div className={`${containerNoFlexPaddingStyles} pt-8`}>
      {' '}
      <PlateEditor
        key={plateEditorKey}
        value={plateEditor}
        onChange={(value) => {
          setPlateEditor(value);
        }}
      />
    </div>
  );
};

export default SinglePage;
