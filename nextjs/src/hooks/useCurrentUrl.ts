import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useCurrentUrl = () => {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const origin = window.location.origin;
    const asPath = router.asPath;
    setCurrentUrl(origin + asPath);
  }, [router.isReady, router.asPath]);

  return currentUrl;
};

export default useCurrentUrl;
