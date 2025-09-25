import MetricsGrid from './MetricsGrid';
import RecentNews from './RecentNews';

export default function Overview() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Market News Overview</h1>
                <p className="text-muted-foreground">Monitor global market developments and client impact</p>
            </div>

            <MetricsGrid />
            <RecentNews />
        </div>
    );
}
