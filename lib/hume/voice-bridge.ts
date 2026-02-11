/**
 * Navigation bridge for the isolated Chip Voice React root.
 *
 * The Chip Voice UI (VoiceProvider + FAB) runs in a separate React root
 * that is NOT part of Next.js's component tree. This means Next.js hooks
 * like `usePathname()` and `useRouter()` are not available inside the
 * voice root.
 *
 * This bridge relays navigation state from Next.js to the voice root
 * using a simple pub/sub pattern:
 *
 * - Next.js side: `ChipVoiceGlobal` (in root layout) calls
 *   `voiceBridge.setPathname()` on every navigation.
 *
 * - Voice root side: `ChipVoiceFab` calls `voiceBridge.subscribe()` to
 *   get pathname updates and `voiceBridge.navigate()` to push routes
 *   back through Next.js's router.
 */

type PathListener = (pathname: string) => void;
type NavigateHandler = (path: string) => void;

class VoiceBridge {
  private _pathname = "/";
  private _listeners: Set<PathListener> = new Set();
  private _navigateHandler: NavigateHandler | null = null;

  /** Current pathname as reported by the Next.js router. */
  get pathname(): string {
    return this._pathname;
  }

  /**
   * Called by ChipVoiceGlobal (Next.js side) whenever the route changes.
   */
  setPathname(pathname: string): void {
    if (this._pathname === pathname) return;
    this._pathname = pathname;
    for (const listener of this._listeners) {
      listener(pathname);
    }
  }

  /**
   * Register a callback to be notified when the pathname changes.
   * Returns an unsubscribe function.
   */
  subscribe(listener: PathListener): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  /**
   * Called by ChipVoiceGlobal to register the Next.js router.push handler.
   */
  setNavigateHandler(handler: NavigateHandler): void {
    this._navigateHandler = handler;
  }

  /**
   * Called by the voice root when Chip wants to navigate to a page.
   * Delegates to the Next.js router via the registered handler.
   */
  navigate(path: string): void {
    if (this._navigateHandler) {
      this._navigateHandler(path);
    } else {
      // Fallback: use window.location if the handler is not yet registered
      window.location.href = path;
    }
  }
}

/** Singleton instance shared between Next.js and the voice root. */
export const voiceBridge = new VoiceBridge();
