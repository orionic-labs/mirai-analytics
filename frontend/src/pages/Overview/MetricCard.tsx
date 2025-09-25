import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
    trend: string;
    change: string;
    icon: React.ElementType;
}

export default function MetricCard({ title, value, description, trend, change, icon: Icon }: MetricCardProps) {
    return (
        <Card className="border-dashboard-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-dashboard-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
                <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-dashboard-success' : 'text-dashboard-danger'}`}>
                        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {change}
                    </div>
                    <span className="text-sm text-muted-foreground">{description}</span>
                </div>
            </CardContent>
        </Card>
    );
}
