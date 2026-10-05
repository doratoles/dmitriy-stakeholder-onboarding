export function SummaryCards() {
    const cards = [
        { id: 1, title: 'Total stakeholders', value: '24' },
        { id: 2, title: 'High influence', value: '6' },
        { id: 3, title: 'Recent interactions', value: '12' },
    ];

    return (
        <section className="summary-cards">
            {cards.map((card) => (
                <div key={card.id} className="card">
                    <span className="card-title">{card.title}</span>
                    <span className="card-value">{card.value}</span>
                </div>
            ))}
        </section>
    );
}