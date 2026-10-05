export function Sidebar() {
    return (
        <nav className="dashboard-sidebar">
            <ul className="sidebar-menu">
                <li className="active"><a href="#dashboard">Dashboard</a></li>
                <li><a href="#stakeholders">Stakeholders</a></li>
                <li><a href="#interactions">Interactions</a></li>
            </ul>
        </nav>
    );
}