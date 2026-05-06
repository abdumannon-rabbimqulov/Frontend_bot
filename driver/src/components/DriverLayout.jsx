import BottomNav from './BottomNav';

export default function DriverLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="mx-auto max-w-md">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
