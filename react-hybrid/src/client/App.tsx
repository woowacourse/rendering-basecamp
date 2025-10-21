import React from 'react';
import { OverlayProvider } from 'overlay-kit';

function App({ Component, initialData }) {
  return (
    <OverlayProvider>
      <Component initialData={initialData} />
    </OverlayProvider>
  );
}

export default App;
