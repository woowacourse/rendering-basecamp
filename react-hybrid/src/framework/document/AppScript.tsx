import { isBrowser } from '../isBrowser';
import { APP_DATA_ID, useAppData } from './context';

export default function AppScript() {
  const appData = useAppData();
  const { assets } = appData;

  return (
    <>
      <script
        id={APP_DATA_ID}
        type="application/json"
        dangerouslySetInnerHTML={{ __html: isBrowser() ? JSON.stringify(appData).replace(/</g, '\\u003c') : '' }}
      />
      {!isBrowser() && assets?.scripts.map((src) => <script key={src} src={src} />)}
    </>
  );
}
