import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import Overview from './pages/Overview';

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Sonner />
            <BrowserRouter>
                <DashboardLayout>
                    <Routes>
                        <Route path="/overview" element={<Overview />} />
                    </Routes>
                </DashboardLayout>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
