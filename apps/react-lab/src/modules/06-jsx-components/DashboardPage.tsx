import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SummaryCards } from './SummaryCards';
import { RecentActivity } from './RecentActivity';
import { Footer } from './Footer';

export function DashboardPage() {
    return (
        <div className="dashboard-layout">
            <Header />
            <div className="dashboard-body">
                <Sidebar />
                <main className="dashboard-content">
                    <h2>Загальна інформація:</h2>
                    <SummaryCards />
                    <RecentActivity />
                </main>
            </div>
            <Footer />
        </div>
    );
}