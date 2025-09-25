import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockData } from '@/lib/mockData';
import NewsItem from './NewsItem';

export default function RecentNews() {
    return (
        <Card className="border-dashboard-primary/10">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Important News</CardTitle>
                <CardDescription>Latest market-moving news requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {mockData.overview.recentNews.map((news) => (
                    <NewsItem key={news.id} {...news} />
                ))}
            </CardContent>
        </Card>
    );
}
