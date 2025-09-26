// src/components/financial/MarketOverview.tsx
import { useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useRealtimeQuotes } from '@/hooks/useRealtimeQuotes';

const ASSETS = [
  { symbol: '^GSPC', label: 'S&P 500' },
  { symbol: '^NDX', label: 'Nasdaq 100' },
  { symbol: 'GC=F', label: 'Gold' },
  { symbol: 'CL=F', label: 'WTI Crude' },
  { symbol: 'EURUSD=X', label: 'EUR/USD' },
  { symbol: 'BTC-USD', label: 'Bitcoin' },
];

function formatPrice(n: number | null, currency?: string) {
  if (n == null) return '—';
  const digits = Math.abs(n) >= 1000 ? 0 : Math.abs(n) >= 100 ? 1 : 2;
  return (
    n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }) +
    (currency ? ` ${currency}` : '')
  );
}

export const MarketOverview: React.FC = () => {
  const symbols = useMemo(() => ASSETS.map((a) => a.symbol), []);
  const { data, loading, error, refreshing, onRefresh } = useRealtimeQuotes(symbols, {
    intervalMs: 30000,
  });

  const merged = ASSETS.map((a) => {
    const q = data.find((d) => d.symbol === a.symbol);
    return {
      ...a,
      price: q?.price ?? null,
      change: q?.change ?? null,
      changePct: q?.changePct ?? null,
      currency: q?.currency,
    };
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Market overview</Text>
        <Pressable onPress={onRefresh} disabled={loading || refreshing} hitSlop={8}>
          <Text style={styles.refreshText}>{refreshing ? 'Refreshing…' : 'Refresh'}</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading live prices…</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Failed to load quotes: {error}</Text>
      ) : null}

      <View style={styles.grid}>
        {merged.map((item) => {
          const up = (item.change ?? 0) >= 0;
          return (
            <View key={item.symbol} style={styles.assetBox}>
              <View style={styles.assetHeader}>
                <Text style={styles.assetLabel}>{item.label}</Text>
                {up ? (
                  <TrendingUp size={14} color="green" />
                ) : (
                  <TrendingDown size={14} color="red" />
                )}
              </View>
              <Text style={styles.priceText}>{formatPrice(item.price, item.currency)}</Text>
              <Text style={[styles.changeText, up ? styles.up : styles.down]}>
                {item.change == null || item.changePct == null
                  ? '—'
                  : `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)} (${item.changePct.toFixed(2)}%)`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  refreshText: { fontSize: 12, fontWeight: '600', color: '#4f46e5' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { color: '#6b7280' },
  errorText: { color: '#ef4444', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  assetBox: {
    flexBasis: '48%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  assetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assetLabel: { fontSize: 13, color: '#374151', fontWeight: '600' },
  priceText: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 6 },
  changeText: { marginTop: 2, fontSize: 12, fontWeight: '600' },
  up: { color: 'green' },
  down: { color: 'red' },
});
