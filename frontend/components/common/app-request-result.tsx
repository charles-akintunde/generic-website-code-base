import { Result } from 'antd';
import { Button } from '../ui/button';
import Link from 'next/link';
import { IAppRequestResult } from '@/types/componentInterfaces';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';

const AppRequestResult: React.FC<IAppRequestResult> = ({
  status,
  title,
  subTitle,
  extra,
}) => (
  <Result status={status} title={title} subTitle={subTitle} extra={extra} />
);

export default AppRequestResult;
