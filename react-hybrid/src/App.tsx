import { RouteLoading } from './components/RouteLoading';
import Router from './router/Router';
import { useAppData } from './document/context';
import './styles/index.css';

export default function App() {
  const { initialPage } = useAppData();

  return (
    <>
      <RouteLoading />
      <Router initialPageData={initialPage} />
    </>
  );
}
