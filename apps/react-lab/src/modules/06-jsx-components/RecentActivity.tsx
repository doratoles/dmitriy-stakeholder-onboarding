export function RecentActivity() {
    interface ActivityUser {
        id: string;
        email: string;
        role: string;
    }

    interface ActivityContext {
        ip_address: string;
        user_agent: string;
        location: string;
        previous_value?: string;
        new_value?: string;
        failure_reason?: string;
        export_format?: string;
        auth_method?: string;
    }

    interface ActivityItem {
        id: string;
        timestamp: string;
        user: ActivityUser;
        action: string;
        resource: string;
        status: 'success' | 'failed';
        context: ActivityContext;
    }

    const activities: ActivityItem[] = [
        {
            id: '1',
            timestamp: '2026-10-06T12:34:56Z',
            user: {
                id: 'usr_4412',
                email: 'alex.p@company.com',
                role: 'administrator'
            },
            action: 'user.role_update',
            resource: 'user_9901',
            status: 'success',
            context: {
                ip_address: '192.168.1.145',
                user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
                location: 'Kyiv, Ukraine',
                previous_value: 'viewer',
                new_value: 'editor'
            }
        },
        {
            id: '2',
            timestamp: '2026-10-06T12:31:12Z',
            user: {
                id: 'usr_0883',
                email: 'elena.m@company.com',
                role: 'editor'
            },
            action: 'document.export',
            resource: 'doc_financial_q3_2026',
            status: 'failed',
            context: {
                ip_address: '185.65.134.22',
                user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
                location: 'Sumy, Ukraine',
                failure_reason: 'insufficient_permissions',
                export_format: 'pdf'
            }
        },
        {
            id: '3',
            timestamp: '2026-10-06T12:28:45Z',
            user: {
                id: 'usr_9901',
                email: 'ivan.k@company.com',
                role: 'viewer'
            },
            action: 'auth.login',
            resource: 'session_active',
            status: 'success',
            context: {
                ip_address: '46.211.89.102',
                user_agent: 'Mozilla/5.0 (Linux; Android 13; SM-S901B)...',
                location: 'Lviv, Ukraine',
                auth_method: 'two_factor_auth'
            }
        }
    ];

    const getActivityText = (item: ActivityItem): string => {
        const userEmail = item.user.email;
        switch (item.action) {
            case 'user.role_update':
                return `${userEmail} змінив роль для ${item.resource} на ${item.context.new_value}`;
            case 'document.export':
                return `${userEmail} намагався експортувати ${item.resource} в ${item.context.export_format} (${item.status === 'failed' ? 'Помилка' : 'Успішно'})`;
            case 'auth.login':
                return `${userEmail} увійшов до системи через ${item.context.auth_method}`;
            default:
                return `${userEmail} виконав дію ${item.action}`;
        }
    };

    const formatValue = (isoString: string): string => {
        return ' ' + new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <section className="recent-activity">
            <h3>Recent Activity</h3>
            <ul className="activity-list">
                {activities.map((item) => (
                    <li key={item.id} className={`activity-item status-${item.status}`}>
                        <span className="activity-text">{getActivityText(item)}</span>
                        <span className="activity-date">{formatValue(item.timestamp)}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}