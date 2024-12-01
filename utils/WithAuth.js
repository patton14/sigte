import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function WithAuth(handler) {
  return async function (req, res) {
    const { data: session, status } = await getSession({ req });
    console.log("Estoy en el middel");
    console.log(session);
    console.log(status);
    if (status === 'loading') {
      res.status(401).send('Loading...');
      return;
    }

    if (!session) {
      const router = useRouter();
      router.push('/login');
      res.end();
      return;
    }

    return handler(req, res);
  };
}