import { hydrateRoot } from 'react-dom/client';
import App from './App';

const initialData = JSON.parse(document.getElementById('initial-data')!.textContent!);

performance.mark('beforeRender');
hydrateRoot(document.getElementById('root')!, <App initialData={initialData} />);
performance.mark('afterHydrate');
// 호출 반환 시점은 hydration 전체가 완료된 시점과 다르다.
performance.measure('hydration-call', 'beforeRender', 'afterHydrate');
