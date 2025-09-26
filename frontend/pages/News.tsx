import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Image,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Clock, ExternalLink, Sparkles } from 'lucide-react-native';

/** --- API models --- */
interface ApiNewsItem {
  id: string | number;
  url: string;
  source: string;
  title: string;
  summary: string;
  publishedAt: string | null;
  photo?: string | null;
  isImportant: boolean;
  importance: 'high' | 'medium' | 'low';
  markets?: string[] | null;
  clients?: string[];
  communitySentiment?: number;
  trustIndex?: number;
}

/** --- UI models --- */
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  relevance: 'portfolio' | 'sector' | 'general';
  url: string;
  photo?: string | null;
}

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_BACKEND_URL ??
  'http://localhost:8000';

function timeAgo(iso: string | null): string {
  if (!iso) return '—';
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - t);
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (s < 60) return `${s}s ago`;
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function toUiItem(a: ApiNewsItem): NewsItem {
  return {
    id: String(a.id),
    title: a.title,
    summary: a.summary,
    source: a.source,
    timestamp: timeAgo(a.publishedAt),
    impact: a.importance,
    relevance: a.isImportant ? 'portfolio' : 'general',
    url: a.url,
    photo: a.photo ?? null,
  };
}

/** Truncating summary with “Show more / less” */
function SummaryText({
  id,
  text,
  expanded,
  setExpanded,
}: {
  id: string;
  text: string;
  expanded: boolean;
  setExpanded: (id: string, v: boolean) => void;
}) {
  const [isTruncatable, setIsTruncatable] = useState(false);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      // If the natural number of lines exceeds clamp, we can show the control
      if (!expanded) {
        const clamped = 3;
        setIsTruncatable(e.nativeEvent.lines.length > clamped);
      }
    },
    [expanded]
  );

  return (
    <View style={{ gap: 4 }}>
      <Text
        style={styles.summary}
        numberOfLines={expanded ? undefined : 3}
        onTextLayout={onTextLayout}>
        {text}
      </Text>
      {(isTruncatable || expanded) && (
        <Pressable onPress={() => setExpanded(id, !expanded)}>
          <Text style={styles.showMore}>{expanded ? 'Show less' : 'Show more'}</Text>
        </Pressable>
      )}
    </View>
  );
}

/* --- local segmented control (pure RN) --- */
function Segmented({
  value,
  onChange,
}: {
  value: 'latest' | 'portfolio' | 'ai-tips';
  onChange: (v: 'latest' | 'portfolio' | 'ai-tips') => void;
}) {
  const options = [
    { key: 'latest', label: 'Latest News' },
    { key: 'portfolio', label: 'Portfolio Impact' },
    { key: 'ai-tips', label: 'AI Tips' },
  ] as const;

  return (
    <View style={styles.segmented}>
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.segmentButton, active && styles.segmentButtonActive]}>
            <Text
              style={[
                styles.segmentText,
                active ? styles.segmentTextActive : styles.segmentTextInactive,
              ]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
/* ----------------------------------------------- */

const aiTips = [
  {
    id: '1',
    title: 'Diversification Opportunity',
    description: 'Consider reducing tech exposure by 5% and increasing healthcare allocation.',
    confidence: 78,
    action: 'Rebalance',
  },
  {
    id: '2',
    title: 'Defensive Play',
    description: 'Utilities showing strong momentum. Good hedge against market volatility.',
    confidence: 85,
    action: 'Consider',
  },
];

export const News: React.FC = () => {
  const [tab, setTab] = useState<'latest' | 'portfolio' | 'ai-tips'>('latest');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const setExpanded = useCallback((id: string, v: boolean) => {
    setExpandedMap((prev) => ({ ...prev, [id]: v }));
  }, []);

  const fetchNews = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/news/list`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiNewsItem[] = await res.json();
      const ui = data.map(toUiItem);
      setItems(ui);
      // reset expansion when list changes
      setExpandedMap({});
    } catch (e: any) {
      setError(e?.message || 'Failed to load news');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchNews();
    } finally {
      setRefreshing(false);
    }
  }, [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const latest = items;
  const portfolio = useMemo(() => items.filter((i) => i.relevance === 'portfolio'), [items]);

  const renderCard = (item: NewsItem, highlight = false) => (
    <Card key={item.id} style={highlight ? styles.cardHighlight : styles.card}>
      <View style={styles.cardBody}>
        {/* Photo */}
        {item.photo ? (
          <Image
            source={{ uri: item.photo }}
            style={styles.photo}
            resizeMode="cover"
            // If image fails, we simply hide it
            onError={() => {
              // noop; could set a local state to hide, but safe to keep
            }}
          />
        ) : null}

        {/* Title */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {highlight && <Badge label="Portfolio Impact" />}
        </View>

        {/* Summary w/ truncation */}
        <SummaryText
          id={item.id}
          text={item.summary}
          expanded={!!expandedMap[item.id]}
          setExpanded={setExpanded}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.sourceRow}>
            <Text style={styles.meta}>{item.source}</Text>
            <Text style={styles.meta}>•</Text>
            <View style={styles.sourceRow}>
              <Clock size={12} />
              <Text style={styles.meta}>{item.timestamp}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Badge label={`${item.impact} impact`} />
            <Pressable onPress={() => Linking.openURL(item.url)} hitSlop={6}>
              <View style={styles.openLink}>
                <ExternalLink size={14} />
                <Text style={styles.openLinkText}>Open</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.contentWrapper}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Market News</Text>
          <Button variant="outline" size="sm">
            <ExternalLink size={16} style={{ marginRight: 6 }} />
            <Text>Sources</Text>
          </Button>
        </View>

        {/* Tabs */}
        <Segmented value={tab} onChange={setTab} />

        {/* Loading / Error */}
        {loading && (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: '#666' }}>Loading news…</Text>
          </View>
        )}
        {!loading && error && (
          <View style={{ paddingVertical: 16, gap: 8 }}>
            <Text style={styles.errorText}>Failed to load news: {error}</Text>
            <Button variant="outline" size="sm" onPress={fetchNews}>
              <Text>Retry</Text>
            </Button>
          </View>
        )}

        {/* Latest News */}
        {!loading && !error && tab === 'latest' && (
          <View style={styles.section}>
            {latest.map((item) => renderCard(item))}
            {latest.length === 0 && (
              <Text style={{ color: '#666' }}>No news matched your filters.</Text>
            )}
          </View>
        )}

        {/* Portfolio Impact */}
        {!loading && !error && tab === 'portfolio' && (
          <View style={styles.section}>
            {portfolio.map((item) => renderCard(item, true))}
            {portfolio.length === 0 && (
              <Text style={{ color: '#666' }}>No portfolio-impacting items yet.</Text>
            )}
          </View>
        )}

        {/* AI Tips */}
        {!loading && !error && tab === 'ai-tips' && (
          <View style={styles.section}>
            {aiTips.map((tip) => (
              <Card key={tip.id} style={styles.card}>
                <View style={styles.cardBody}>
                  <View style={styles.tipRow}>
                    <Sparkles size={20} style={styles.sparkleIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>

                      {/* Keep consistent truncation UX in tips too (optional) */}
                      <Text style={styles.summary}>{tip.description}</Text>

                      <View style={styles.footer}>
                        <View style={styles.confidenceRow}>
                          <Text style={styles.meta}>Confidence:</Text>
                          <View style={styles.progressRow}>
                            <View style={styles.progressBar}>
                              <View
                                style={[styles.progressFill, { width: `${tip.confidence}%` }]}
                              />
                            </View>
                            <Text style={styles.confidenceText}>{tip.confidence}%</Text>
                          </View>
                        </View>

                        <Button size="sm" style={styles.actionButton}>
                          <Text style={styles.actionText}>{tip.action}</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 96 },
  contentWrapper: { gap: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },

  segmented: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#eee',
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 4,
  },
  segmentButtonActive: { backgroundColor: '#fff', elevation: 2 },
  segmentText: { fontSize: 14, fontWeight: '500' },
  segmentTextActive: { color: '#000' },
  segmentTextInactive: { color: '#666' },

  section: { marginTop: 12, gap: 16 },

  card: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 },
  cardHighlight: {
    borderWidth: 1,
    borderColor: '#b9a4ff',
    backgroundColor: '#f4f0ff',
    padding: 12,
    borderRadius: 8,
  },
  cardBody: { gap: 12 },

  photo: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
  },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },

  summary: { fontSize: 13, color: '#555', lineHeight: 20 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  openLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  openLinkText: { fontSize: 12, fontWeight: '500' },

  meta: { fontSize: 11, color: '#777' },
  badges: { flexDirection: 'row', gap: 8 },

  // AI tips
  tipRow: { flexDirection: 'row', gap: 12 },
  sparkleIcon: { color: '#7c3aed', marginTop: 2 },
  tipTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },

  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  progressBar: {
    width: 64,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#4f46e5' },
  confidenceText: { fontSize: 11, fontWeight: '500', color: '#4f46e5' },

  actionButton: { backgroundColor: '#4f46e5' },
  actionText: { color: '#fff' },

  showMore: { fontSize: 12, fontWeight: '500', color: '#4f46e5' },

  errorText: { color: '#b00020' },
});
