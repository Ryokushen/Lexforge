import { BookOpen, WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <BookOpen className="size-16 text-muted-foreground/30" />
          <WifiOff className="size-6 text-red-500 absolute -bottom-1 -right-1" />
        </div>
        <h1 className="text-2xl font-bold">You're Offline</h1>
        <p className="text-muted-foreground max-w-sm">
          Your connection dropped. Previously visited pages are still available —
          head back or try again when you're reconnected.
        </p>
      </div>
    </main>
  );
}
