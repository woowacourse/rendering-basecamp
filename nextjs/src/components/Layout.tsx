import { Footer } from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="wrap">
      {children}
      <Footer />
    </div>
  );
}
