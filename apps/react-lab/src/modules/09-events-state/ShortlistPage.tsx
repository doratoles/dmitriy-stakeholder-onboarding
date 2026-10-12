import { useState, useEffect } from 'react';
import { stakeholders } from './data';
import type { Stakeholder } from './types';
import { StakeholderRow } from './StakeholderRow';

export function ShortlistPage() {
    const [collection, setData] = useState<Stakeholder[]>(stakeholders);
    const [name, setName] = useState('');

    useEffect(() => {
        console.log('Оновлений collection:', collection);
    }, [collection]);

    const selectedCount = collection.filter(item => item.selected).length;
    const totalCount = collection.length;

    const handleAddStakeholder = () => {
        if (!name.trim()) return;

        const nextId = collection.length > 0 ? Math.max(...collection.map((item) => item.id)) + 1 : 1;

        const newStakeholder: Stakeholder = {
            id: nextId,
            name: name,
            selected: false,
        };

        setData(
            [
                ...collection,
                newStakeholder
            ]
        );
        setName('');
    };
    function handleToggleStakeholder(stakeholderId: number, nextSeen: boolean) {
        setData(collection.map(stakeholder => {
            if (stakeholder.id === stakeholderId) {
                return { ...stakeholder, selected: nextSeen };
            } else {
                return stakeholder;
            }
        }));
    }
    function handleRemoveStakeholder(stakeholderId: number) {
        setData(
            collection.filter(stakeholder =>
                stakeholder.id !== stakeholderId
            )
        )
    }

    const handleReset = () => {
        setData(stakeholders);
        setName('');
    };
    return (
        <div className="shortlist-container">
            <div className="add-stakeholder-bar">
                <input
                    type="text"
                    className="stakeholder-input"
                    placeholder="New stakeholder name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="btn-base btn-add" onClick={handleAddStakeholder}>
                    Add
                </button>
            </div>

            <div className="shortlist-toolbar">
                <div className="status-counter">Selected: {selectedCount} / {totalCount}</div>
                <button className="btn-base btn-reset" onClick={handleReset}>
                    Reset
                </button>
            </div>

            <ul className="short-list">
                {collection.map((item) => (
                    <StakeholderRow key={item.id} stakeholder={item} onToggle={handleToggleStakeholder} onRemove={handleRemoveStakeholder}/>
                ))}
            </ul>
        </div>
    );
}