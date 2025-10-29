import { type PropsWithChildren, use } from "react";
import { delay } from "../../utils/delay";

interface DelayProps {
  ms?: number;
}

function DelayWithThrowPromise({
  ms = 1000,
  children,
}: PropsWithChildren<DelayProps>) {
  use(delay(ms));

  return <>{children}</>;
}

export default DelayWithThrowPromise;
