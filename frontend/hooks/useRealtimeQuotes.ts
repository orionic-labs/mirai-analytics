// src/hooks/useRealtimeQuotes.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getQuotes, type Quote } from '@/services/marketData';

type Options = { intervalMs?: number };

export function useRealtimeQuotes(symbols: string[], opts: Options = {}) {
  const intervalMs = opts.intervalMs ?? 30000;
  const [data, setData] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appState = useRef<AppStateStatus>(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable key based on contents (not array identity)
  const symbolsKey = useMemo(() => symbols.join(','), [symbols]);

  const fetchOnce = useCallback(async () => {
    try {
      setError(null);
      const d = await getQuotes(symbols); // uses current symbols
      setData(d);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load quotes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [symbolsKey]); // rerun only if contents changed

  useEffect(() => {
    fetchOnce();
  }, [fetchOnce]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appState.current;
      appState.current = next;
      if (prev.match(/inactive|background/) && next === 'active') fetchOnce();
    });
    return () => sub.remove();
  }, [fetchOnce]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(fetchOnce, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchOnce, intervalMs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOnce();
  }, [fetchOnce]);

  return { data, loading, error, refreshing, onRefresh, refetch: fetchOnce };
}
