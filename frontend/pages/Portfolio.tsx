import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react-native';

/* --- local primitives (navigation-free) --- */
const Surface = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View
    style={[
      {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 16,
        backgroundColor: 'white',
      },
      style,
    ]}>
    {children}
  </View>
);

const Pill = ({ label, style }: { label: string; style?: any }) => (
  <View
    style={[
      {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
      },
      style,
    ]}>
    <Text style={{ fontSize: 11, fontWeight: '600', color: '#374151' }}>{label}</Text>
  </View>
);

const Btn = ({
  children,
  outline,
  onPress,
  style,
}: {
  children: React.ReactNode;
  outline?: boolean;
  onPress?: () => void;
  style?: any;
}) => (
  <Pressable
    onPress={onPress}
    style={[
      {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      },
      outline
        ? { borderWidth: 1, borderColor: '#d1d5db', backgroundColor: 'transparent' }
        : { backgroundColor: '#2563eb' },
      style,
    ]}>
    {children}
  </Pressable>
);
/* ------------------------------------------ */

/** Backend item shape */
type BackendHolding = {
  company: string;
  ticker: string;
  last_price?: number;
  allocation_percent: number;
  change_7d?: number;
  trend?: 'up' | 'down' | 'flat' | string;
  error?: string;
};

/** ENV base — use whichever you already set, falls back to localhost */
const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_BACKEND_URL ??
  'http://localhost:8000';

/** Best-effort extraction to support a few plausible response shapes */
function extractHoldings(json: any): BackendHolding[] {
  const candidateRoots: any[] = [
    json?.portfolio,
    json?.results,
    json, // just in case the API already returns an array at root
  ].filter(Boolean);

  for (const root of candidateRoots) {
    if (Array.isArray(root)) return root as BackendHolding[];
    if (root && typeof root === 'object') {
      // look for the first array field that looks like holdings
      const arr = Object.values(root).find(
        (v) =>
          Array.isArray(v) &&
          v.some(
            (x: any) =>
              x &&
              typeof x === 'object' &&
              ('ticker' in x || 'company' in x || 'allocation_percent' in x)
          )
      );
      if (Array.isArray(arr)) return arr as BackendHolding[];
    }
  }
  return [];
}

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<BackendHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/portfolio/current_status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const holdings = extractHoldings(json);
      setItems(holdings);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load portfolio');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const upColor = '#10b981';
  const downColor = '#ef4444';
  const gray = '#6b7280';

  const fmtPct = (v?: number) =>
    typeof v === 'number' && !Number.isNaN(v) ? `${v >= 0 ? '' : ''}${v.toFixed(2)}%` : '—';
  const fmtPrice = (v?: number) => (typeof v === 'number' && !Number.isNaN(v) ? v.toFixed(2) : '—');

  return (
    <ScrollView
      style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 96 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ gap: 20 }}>
        {/* Header */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 22, fontWeight: '800' }}>Portfolio</Text>
          <Btn outline onPress={fetchData}>
            <Text style={{ color: '#111827' }}>Refresh</Text>
          </Btn>
        </View>

        {/* Loading / Error */}
        {loading && (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: gray }}>Loading portfolio…</Text>
          </View>
        )}
        {!loading && err && (
          <Surface>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} color={downColor} />
              <Text style={{ color: downColor, fontWeight: '600' }}>Failed to load: {err}</Text>
            </View>
          </Surface>
        )}

        {/* Holdings list (only backend-supported fields) */}
        {!loading && !err && (
          <View style={{ gap: 16 }}>
            {items.map((h) => {
              const trendUp = String(h.trend).toLowerCase() === 'up';
              const trendDown = String(h.trend).toLowerCase() === 'down';

              return (
                <Surface
                  key={`${h.ticker}-${h.company}`}
                  style={
                    h.error ? { borderColor: '#fecaca', backgroundColor: '#fff1f2' } : undefined
                  }>
                  <View style={{ gap: 12 }}>
                    {/* Top row: ticker/company + trend */}
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontWeight: '800' }}>{h.ticker}</Text>
                        </View>
                        <Text style={{ color: gray, marginTop: 2 }}>{h.company}</Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        {trendUp && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <TrendingUp size={18} color={upColor} />
                            <Text style={{ color: upColor, fontWeight: '700' }}>
                              {fmtPct(h.change_7d)}
                            </Text>
                          </View>
                        )}
                        {trendDown && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <TrendingDown size={18} color={downColor} />
                            <Text style={{ color: downColor, fontWeight: '700' }}>
                              {fmtPct(h.change_7d)}
                            </Text>
                          </View>
                        )}
                        {!trendUp && !trendDown && (
                          <Text style={{ color: gray, fontWeight: '600' }}>
                            {fmtPct(h.change_7d)}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Last price (if provided) */}
                    {'last_price' in h && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: gray, fontSize: 12 }}>Last Price</Text>
                        <Text style={{ fontWeight: '700' }}>{fmtPrice(h.last_price)}</Text>
                      </View>
                    )}

                    {/* Allocation bar (always shown, backend provides allocation_percent) */}
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 6,
                        }}>
                        <Text style={{ fontWeight: '600' }}>Allocation</Text>
                        <Text style={{ fontWeight: '700' }}>{fmtPct(h.allocation_percent)}</Text>
                      </View>
                      <View style={styles.allocTrack}>
                        <View
                          style={[
                            styles.allocFill,
                            { width: `${Math.max(0, Math.min(100, h.allocation_percent))}%` },
                          ]}
                        />
                      </View>
                    </View>

                    {/* Error row if present */}
                    {h.error && (
                      <View
                        style={{
                          borderTopWidth: 1,
                          borderTopColor: '#fecaca',
                          marginTop: 6,
                          paddingTop: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                        <AlertCircle size={16} color={downColor} />
                        <Text style={{ color: downColor, fontSize: 13, flex: 1 }}>{h.error}</Text>
                        <Pill label="Partial data" style={{ borderColor: '#fecaca' }} />
                      </View>
                    )}
                  </View>
                </Surface>
              );
            })}

            {items.length === 0 && (
              <Text style={{ color: gray }}>No positions returned by the backend.</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  allocTrack: {
    height: 8,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  allocFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#3b82f6',
  },
});
