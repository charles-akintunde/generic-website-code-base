import { Result } from 'antd';
import { IAppRequestResult } from '@/types/componentInterfaces';

const AppRequestResult: React.FC<IAppRequestResult> = ({
  status,
  title,
  subTitle,
  extra,
}) => (
  <Result status={status} title={title} subTitle={subTitle} extra={extra} />
);

export default AppRequestResult;
