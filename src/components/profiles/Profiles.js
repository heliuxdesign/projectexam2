import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';

export default function Contact() {
  useCheckCredentials();
  return (
    <>
  <Heading title="Profiles" />
  <p>This is the shit page</p>
  </>
  )
}