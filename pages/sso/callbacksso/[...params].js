import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";


const Callbacksso = () => {
  const router = useRouter();
  const { params } = router.query;
  const user = params?.[0];
  const token = params?.[1];

  useEffect(() => {
    const handleSignIn = async () => {
      await signIn("cred", { user, token });
    };

    if (user && token) {
      handleSignIn();
    }
  }, [user, token]);
  return (
    <>

    </>
  );
};

export default Callbacksso;
