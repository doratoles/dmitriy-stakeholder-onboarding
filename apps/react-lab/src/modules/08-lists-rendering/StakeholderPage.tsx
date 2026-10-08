import { useState } from "react";
import type { Stakeholder } from './types';
import { stakeholders } from './data';
import { StakeholderList } from './StakeholderList';

export function StakeholderPage() {
    const [data, setData] = useState<Stakeholder[]>(stakeholders);

    const isAll = data.length > 0;

    return (
        <div className="stakeholder-page">
            <h1 className="stakeholder-page-title">Stakeholders state</h1>

            <div className="stakeholder-controls">
                <button
                    type="button"
                    className={`stakeholder-btn ${isAll ? 'stakeholder-btn--active' : ''}`}
                    onClick={() => setData(stakeholders)}
                >
                    Show all
                </button>
                <button
                    type="button"
                    className={`stakeholder-btn ${!isAll ? 'stakeholder-btn--active' : ''}`}
                    onClick={() => setData([])}
                >
                    Show empty
                </button>
            </div>

            <StakeholderList stakeholders={data} />
        </div>
    );
}