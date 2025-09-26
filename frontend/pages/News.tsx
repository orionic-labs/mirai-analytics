import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, Clock, ExternalLink, Sparkles } from 'lucide-react-native';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  relevance: 'portfolio' | 'sector' | 'general';
  priceChange?: string;
  trend?: 'up' | 'down';
}

const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'AI Chip Demand Soars as Tech Giants Expand Infrastructure',
    summary:
      'Major cloud providers announce $50B investment in AI infrastructure, driving semiconductor stocks higher.',
    source: 'TechCrunch',
    timestamp: '1h ago',
    impact: 'high',
    relevance: 'portfolio',
    priceChange: '+3.2%',
    trend: 'up',
  },
  {
    id: '2',
    title: 'Federal Reserve Maintains Hawkish Stance on Interest Rates',
    summary:
      'Fed officials signal potential for additional rate hikes amid persistent inflation concerns.',
    source: 'Bloomberg',
    timestamp: '2h ago',
    impact: 'high',
    relevance: 'general',
    priceChange: '-1.8%',
    trend: 'down',
  },
  {
    id: '3',
    title: 'Green Energy Stocks Rally on New Climate Legislation',
    summary:
      'Renewable energy companies surge following passage of expanded clean energy incentives.',
    source: 'Reuters',
    timestamp: '3h ago',
    impact: 'medium',
    relevance: 'sector',
    priceChange: '+2.7%',
    trend: 'up',
  },
];

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

export const News: React.FC = () => {
  const [tab, setTab] = useState<'latest' | 'portfolio' | 'ai-tips'>('latest');

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

        {/* Latest News */}
        {tab === 'latest' && (
          <View style={styles.section}>
            {newsData.map((item) => (
              <Card key={item.id} style={styles.card}>
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {item.priceChange && (
                      <View
                        style={[
                          styles.priceChange,
                          item.trend === 'up' ? styles.priceUp : styles.priceDown,
                        ]}>
                        <TrendingUp
                          size={12}
                          style={item.trend === 'down' ? { transform: [{ rotate: '180deg' }] } : {}}
                        />
                        <Text>{item.priceChange}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.summary}>{item.summary}</Text>

                  <View style={styles.footer}>
                    <View style={styles.sourceRow}>
                      <Text style={styles.meta}>{item.source}</Text>
                      <Text style={styles.meta}>•</Text>
                      <View style={styles.sourceRow}>
                        <Clock size={12} />
                        <Text style={styles.meta}>{item.timestamp}</Text>
                      </View>
                    </View>

                    <View style={styles.badges}>
                      <Badge label={item.relevance} />
                      <Badge label={`${item.impact} impact`} />
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Portfolio Impact */}
        {tab === 'portfolio' && (
          <View style={styles.section}>
            {newsData
              .filter((item) => item.relevance === 'portfolio')
              .map((item) => (
                <Card key={item.id} style={styles.cardHighlight}>
                  <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Badge label="Portfolio Impact" />
                    </View>
                    <Text style={styles.summary}>{item.summary}</Text>
                    <Button variant="outline" size="sm" style={{ width: '100%' }}>
                      <Text>View Impact Analysis</Text>
                    </Button>
                  </View>
                </Card>
              ))}
          </View>
        )}

        {/* AI Tips */}
        {tab === 'ai-tips' && (
          <View style={styles.section}>
            {aiTips.map((tip) => (
              <Card key={tip.id} style={styles.card}>
                <View style={styles.cardBody}>
                  <View style={styles.tipRow}>
                    <Sparkles size={20} style={styles.sparkleIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>
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
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
  },
  contentWrapper: {
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
  segmentButtonActive: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  segmentText: { fontSize: 14, fontWeight: '500' },
  segmentTextActive: { color: '#000' },
  segmentTextInactive: { color: '#666' },

  section: { marginTop: 12, gap: 16 },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
  },
  cardHighlight: {
    borderWidth: 1,
    borderColor: '#b9a4ff',
    backgroundColor: '#f4f0ff',
    padding: 12,
    borderRadius: 8,
  },
  cardBody: { gap: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },

  summary: { fontSize: 13, color: '#555', lineHeight: 20 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 11, color: '#777' },
  badges: { flexDirection: 'row', gap: 8 },

  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  priceUp: { color: 'green' },
  priceDown: { color: 'red' },

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
  progressFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
  },
  confidenceText: { fontSize: 11, fontWeight: '500', color: '#4f46e5' },

  actionButton: { backgroundColor: '#4f46e5' },
  actionText: { color: '#fff' },
});
