import { useLoginState } from '../../components/custom-hooks/login-state';

export default function Dashboard(): JSX.Element {
  useLoginState();

  return null;
}
