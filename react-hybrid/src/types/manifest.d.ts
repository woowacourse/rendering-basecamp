declare module '*manifest.json' {
  const manifest: Pick<import('../framework/document/context').AppData, 'origin' | 'assets'>;
  export default manifest;
}
