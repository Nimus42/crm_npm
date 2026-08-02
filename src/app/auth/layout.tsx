import GuestGuard from '../../components/guards/GuestGuard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-white">RushdDigital</h1>
            <p className="text-sm text-neutral-400 mt-2">Вход в систему</p>
          </div>
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}