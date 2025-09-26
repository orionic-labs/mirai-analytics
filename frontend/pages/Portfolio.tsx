import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { TrendingUp, TrendingDown, AlertCircle, PieChart, Activity } from 'lucide-react-native';

// --- local primitives (navigation-free) ---
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
// ------------------------------------------

interface Holding {
  symbol: string;
  name: string;
  value: number;
  shares: number;
  price: number;
  change: number;
  changePercent: number;
  allocation: number;
  newsImpact?: boolean;
}
interface PortfolioData {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  dayRange: { low: number; high: number };
  holdings: Holding[];
}

const portfolioData: PortfolioData = {
  totalValue: 125430.5,
  totalChange: 2341.2,
  totalChangePercent: 1.87,
  dayRange: { low: 123089.3, high: 125780.9 },
  holdings: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      value: 25086.1,
      shares: 140,
      price: 179.18,
      change: 2.45,
      changePercent: 1.39,
      allocation: 20.0,
      newsImpact: true,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      value: 22654.8,
      shares: 65,
      price: 348.53,
      change: -4.67,
      changePercent: -1.32,
      allocation: 18.1,
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      value: 18742.2,
      shares: 45,
      price: 416.49,
      change: 12.85,
      changePercent: 3.18,
      allocation: 14.9,
      newsImpact: true,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      value: 15234.7,
      shares: 112,
      price: 136.02,
      change: 1.89,
      changePercent: 1.41,
      allocation: 12.1,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      value: 12845.6,
      shares: 78,
      price: 164.69,
      change: -8.32,
      changePercent: -4.81,
      allocation: 10.2,
    },
  ],
};

const assetAllocation = [
  { category: 'Technology', percentage: 65, color: '#3b82f6' },
  { category: 'Healthcare', percentage: 15, color: '#22c55e' },
  { category: 'Finance', percentage: 12, color: '#eab308' },
  { category: 'Energy', percentage: 8, color: '#ef4444' },
];

function Segmented({
  value,
  onChange,
}: {
  value: 'holdings' | 'allocation';
  onChange: (v: 'holdings' | 'allocation') => void;
}) {
  return (
    <View
      style={{
        backgroundColor: '#f3f4f6',
        height: 40,
        borderRadius: 10,
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {(['holdings', 'allocation'] as const).map((k) => {
        const active = value === k;
        return (
          <Pressable
            key={k}
            onPress={() => onChange(k)}
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                paddingVertical: 6,
              },
              active && {
                backgroundColor: 'white',
                elevation: 1,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
              },
            ]}>
            <Text
              style={{ fontSize: 14, fontWeight: '600', color: active ? '#111827' : '#6b7280' }}>
              {k === 'holdings' ? 'Holdings' : 'Allocation'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const Portfolio: React.FC = () => {
  const [tab, setTab] = useState<'holdings' | 'allocation'>('holdings');

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(v);

  return (
    <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 96 }}>
      <View style={{ gap: 20 }}>
        {/* Header */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 22, fontWeight: '800' }}>Portfolio</Text>
          <Btn outline style={{ flexDirection: 'row' }}>
            <Activity size={16} color="#111827" />
            <Text style={{ marginLeft: 6, color: '#111827' }}>Analytics</Text>
          </Btn>
        </View>

        {/* Summary */}
        <Surface>
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>Total Value</Text>
                <Text style={{ fontSize: 28, fontWeight: '800' }}>
                  {fmt(portfolioData.totalValue)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  {portfolioData.totalChange >= 0 ? (
                    <TrendingUp size={20} color="#10b981" />
                  ) : (
                    <TrendingDown size={20} color="#ef4444" />
                  )}
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: portfolioData.totalChange >= 0 ? '#10b981' : '#ef4444',
                    }}>
                    {fmt(Math.abs(portfolioData.totalChange))}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: portfolioData.totalChange >= 0 ? '#10b981' : '#ef4444',
                  }}>
                  ({portfolioData.totalChangePercent >= 0 ? '+' : ''}
                  {portfolioData.totalChangePercent}%)
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>Day Range</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>
                {fmt(portfolioData.dayRange.low)} – {fmt(portfolioData.dayRange.high)}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Segmented */}
        <Segmented value={tab} onChange={setTab} />

        {/* Holdings */}
        {tab === 'holdings' && (
          <View style={{ gap: 16, marginTop: 12 }}>
            {portfolioData.holdings.map((h) => (
              <Surface key={h.symbol} style={[h.newsImpact && { borderColor: '#e9d5ff' }]}>
                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* Left */}
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 4,
                        }}>
                        <Text style={{ fontWeight: '700' }}>{h.symbol}</Text>
                        {h.newsImpact && <AlertCircle size={16} color="#8b5cf6" />}
                      </View>
                      <Text style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>
                        {h.name}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 16 }}>
                        <Text style={{ color: '#6b7280', fontSize: 12 }}>{h.shares} shares</Text>
                        <Text style={{ color: '#6b7280', fontSize: 12 }}>@{fmt(h.price)}</Text>
                        <Text style={{ color: '#6b7280', fontSize: 12 }}>
                          {h.allocation}% allocation
                        </Text>
                      </View>
                    </View>
                    {/* Right */}
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: '700', marginBottom: 4 }}>{fmt(h.value)}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        {h.change >= 0 ? (
                          <TrendingUp size={12} color="#10b981" />
                        ) : (
                          <TrendingDown size={12} color="#ef4444" />
                        )}
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: h.change >= 0 ? '#10b981' : '#ef4444',
                          }}>
                          {fmt(Math.abs(h.change))}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 12, color: h.change >= 0 ? '#10b981' : '#ef4444' }}>
                        ({h.changePercent >= 0 ? '+' : ''}
                        {h.changePercent}%)
                      </Text>
                    </View>
                  </View>

                  {h.newsImpact && (
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderTopColor: '#e5e7eb',
                        marginTop: 6,
                        paddingTop: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <Pill label="News Impact" style={{ borderColor: '#e9d5ff' }} />
                      <Btn outline style={{ marginLeft: 'auto' }}>
                        <Text>View Details</Text>
                      </Btn>
                    </View>
                  )}
                </View>
              </Surface>
            ))}
          </View>
        )}

        {/* Allocation */}
        {tab === 'allocation' && (
          <View style={{ gap: 16, marginTop: 12 }}>
            <Surface>
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <PieChart size={18} color="#3b82f6" />
                  <Text style={{ fontWeight: '700' }}>Asset Allocation</Text>
                </View>

                <View style={{ gap: 16 }}>
                  {assetAllocation.map((a) => (
                    <View key={a.category}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 6,
                        }}>
                        <Text style={{ fontWeight: '600' }}>{a.category}</Text>
                        <Text style={{ fontWeight: '700', color: a.color }}>{a.percentage}%</Text>
                      </View>
                      <View
                        style={{
                          height: 8,
                          width: '100%',
                          overflow: 'hidden',
                          borderRadius: 999,
                          backgroundColor: '#e5e7eb',
                        }}>
                        <View
                          style={{
                            height: '100%',
                            width: `${a.percentage}%`,
                            borderRadius: 999,
                            backgroundColor: a.color,
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Surface>

            <Surface>
              <Text style={{ fontWeight: '700', marginBottom: 6 }}>Rebalancing Suggestions</Text>
              <View style={{ gap: 4 }}>
                <Text style={{ color: '#6b7280', fontSize: 13 }}>
                  • Consider reducing tech exposure to 60% for better diversification
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 13 }}>
                  • Healthcare allocation could be increased to 18%
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 13 }}>
                  • Energy sector showing strong momentum for Q1 2024
                </Text>
              </View>
              <Btn style={{ marginTop: 10 }}>
                <Text style={{ color: 'white' }}>View Full Analysis</Text>
              </Btn>
            </Surface>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
