import { StakeholderForm } from './StakeholderForm';

export function StakeholderFormPage() {
    return (
        <main className="stakeholder-page-container">
            <header className="stakeholder-page-header">
                <h1 className="stakeholder-page-title">Управління стейкхолдерами</h1>
                <p className="stakeholder-page-subtitle">
                    Заповніть форму для реєстрації ключової особи або зацікавленої сторони проєкту.
                </p>
            </header>

            <StakeholderForm />
        </main>
    );
}