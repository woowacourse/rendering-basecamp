import { APP_DATA_ID, useAppData } from './context';

export default function AppScript() {
  const appData = useAppData();

  const { assets, initialPage } = appData;

  const renderAssets = typeof window === 'undefined' || initialPage !== undefined;

  return (
    <>
      <script
        id={APP_DATA_ID}
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appData).replace(/</g, '\\u003c') }}
      />
      {renderAssets && assets?.scripts.map((src) => <script key={src} src={src} />)}
    </>
  );
}
