import { useState, useEffect } from "react";
import type { Stakeholder, Status } from "./types";

export function AsyncStakeholderPage() {
	const [status, setStatus] = useState<Status>('idle');
	const [data, setData] = useState<Stakeholder[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [url, setCurrentUrl] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState<number>(0);
	const [fetchTrigger, setFetchTrigger] = useState<number>(0);

	const count = data.length;

	useEffect(() => {
		if (!url) return;

		const targetUrl = url;
		const controller = new AbortController();

		async function load(fetchUrl: string) {
			setStatus('loading');
			setErrorMessage(null);

			try {
				const response = await fetch(fetchUrl, {
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error(`Помилка запиту: HTTP ${response.status}`);
				}

				const result: Stakeholder[] = await response.json();
				setData(result);
				setStatus('success');
			} catch (err) {
				if (err instanceof Error && err.name === 'AbortError') {
					console.log('Запит скасовано:', controller.signal.reason);
					return;
				}

				setData([]);
				const message = err instanceof Error ? err.message : 'Непередбачена помилка';
				setErrorMessage(message);
				setStatus('error');
			}
		}

		load(targetUrl);

		return () => {
			controller.abort();
		};
	}, [url, fetchTrigger]);

	const handleRetry = () => {
		setRetryCount((prev) => prev + 1);
		setFetchTrigger((prev) => prev + 1);
	};

	const handleSelectUrl = (nextUrl: string) => {
		setRetryCount(0);

		if (nextUrl === '/missing-url.json') {
			setData([]);
		}

		setCurrentUrl(nextUrl);

		setFetchTrigger((prev) => prev + 1);
	};

	return (
		<div className="stakeholder-container">
			<h2 className="stakeholder-title">Async stakeholders</h2>

			<div className="stakeholder-toolbar">
				<button className="btn" onClick={() => handleSelectUrl('/stakeholders.json')}>Load data</button>
				<button className="btn" onClick={() => handleSelectUrl('data:application/json,[]')}>Load empty</button>
				<button className="btn" onClick={() => handleSelectUrl('/missing-url.json')}>Simulate error</button>
			</div>

			<p className="stakeholder-count">
				Всього стейкхолдерів: <strong>{count} </strong>
				{retryCount > 0 && <strong>Кількість спроб: {retryCount}</strong>}
			</p>

			<hr className="stakeholder-divider" />

			{status === 'loading' && (
				<div className="state-box state-loading">
					<em>Loading…</em>
				</div>
			)}

			{status === 'success' && count > 0 && (
				<ul className="stakeholder-list">
					{data.map((stakeholder) => (
						<li key={stakeholder.id} className="stakeholder-card">
							<div className="stakeholder-header">
								<strong>{stakeholder.name}</strong> — <span>{stakeholder.role}</span>
							</div>
							<div className="stakeholder-organization">{stakeholder.organization}</div>
						</li>
					))}
				</ul>
			)}

			{status === 'success' && count === 0 && (
				<p className="state-empty">No stakeholders found</p>
			)}

			{status === 'error' && (
				<div className="state-box state-error">
					<p className="error-message">
						<strong>Помилка:</strong> {errorMessage}
					</p>
					<button className="btn btn-retry" onClick={handleRetry}>Retry</button>
				</div>
			)}
		</div>
	);
}