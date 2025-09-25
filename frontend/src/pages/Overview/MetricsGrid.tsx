import MetricCard from './MetricCard';
import { mockData } from '@/lib/mockData';

export default function MetricsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockData.overview.metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
            ))}
        </div>
    );
}
