import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';

export default function Posts() {
  useCheckCredentials();
  return (
    <>
      <Heading title="Posts" />
      <p>This is the about page</p>
    </>
  );
}