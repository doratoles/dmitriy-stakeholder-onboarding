const header_styles = {
    textDecoration: 'none'
};
export function Header() {
    return (
        <header className="dashboard-header">
            <div className="header-logo">
                <a href="#dashboard" style={header_styles}>Dashboard</a>
            </div>
        </header>
    );
}