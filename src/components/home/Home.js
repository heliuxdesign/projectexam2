import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';

export default function Home() {
    useCheckCredentials();
    return <Heading title="Home" />;
}