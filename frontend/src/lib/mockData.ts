import { FileText, Users, Globe, AlertTriangle } from 'lucide-react';

export const mockData = {
    overview: {
        metrics: [
            {
                title: 'Total News Today',
                value: '247',
                change: '+12%',
                trend: 'up',
                icon: FileText,
                description: 'vs yesterday',
            },
            {
                title: 'Active Markets',
                value: '18',
                change: '+2',
                trend: 'up',
                icon: Globe,
                description: 'markets tracked',
            },
            {
                title: 'Client Alerts',
                value: '34',
                change: '-8%',
                trend: 'down',
                icon: Users,
                description: 'notifications sent',
            },
            {
                title: 'Important News',
                value: '12',
                change: '+3',
                trend: 'up',
                icon: AlertTriangle,
                description: 'require attention',
            },
        ],
        recentNews: [
            {
                id: 1,
                title: 'Federal Reserve Announces Interest Rate Decision',
                summary: 'The Fed maintains current rates amid economic uncertainty and inflation concerns.',
                markets: ['USD', 'Bonds', 'Equities'],
                clients: ['JP Morgan', 'Goldman Sachs'],
                importance: 'high',
                time: '2 min ago',
            },
            {
                id: 2,
                title: 'Oil Prices Surge Following OPEC Meeting',
                summary: 'Crude oil prices jump 3% after OPEC+ announces production cuts.',
                markets: ['Energy', 'Commodities'],
                clients: ['Shell', 'ExxonMobil'],
                importance: 'high',
                time: '15 min ago',
            },
            {
                id: 3,
                title: 'Tech Earnings Beat Expectations',
                summary: 'Major technology companies report stronger than expected quarterly results.',
                markets: ['NASDAQ', 'Technology'],
                clients: ['Microsoft', 'Apple'],
                importance: 'medium',
                time: '1 hour ago',
            },
        ],
    },
};
