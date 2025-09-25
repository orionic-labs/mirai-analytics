import { Badge } from '@/components/ui/badge';

interface NewsItemProps {
    id: number;
    title: string;
    time: string;
    summary: string;
    importance: string;
    markets: string[];
    clients: string[];
}

export default function NewsItem({ id, title, time, summary, importance, markets, clients }: NewsItemProps) {
    return (
        <div key={id} className="border border-dashboard-primary/10 rounded-lg p-4 hover:bg-muted/10 transition-colors">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${importance === 'high' ? 'bg-dashboard-danger' : 'bg-dashboard-warning'}`}></div>
                    <h3 className="font-medium text-foreground">{title}</h3>
                </div>
                <span className="text-sm text-muted-foreground">{time}</span>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{summary}</p>

            <div className="flex flex-wrap gap-3">
                <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-xs text-muted-foreground">Markets:</span>
                    {markets.map((m) => (
                        <Badge key={m} variant="secondary" className="text-xs">
                            {m}
                        </Badge>
                    ))}
                </div>
                <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-xs text-muted-foreground">Clients:</span>
                    {clients.map((c) => (
                        <Badge key={c} variant="outline" className="text-xs">
                            {c}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
