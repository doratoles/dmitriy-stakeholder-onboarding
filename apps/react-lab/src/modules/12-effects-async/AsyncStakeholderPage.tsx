import { useState, useEffect } from "react";
import type { Stakeholder, Status } from "./types";

export function AsyncStakeholderPage() {
	const [status, setStatus] = useState<Status>('idle');
	const [data, setData] = useState<Stakeholder[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [url, setCurrentUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!url) return;

		const targetUrl = url;
		const controller = new AbortController();

		async function load(fetchUrl: string) {
			try {
				const response = await fetch(fetchUrl, {
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error(`Помилка запиту: HTTP ${response.status}`);
				}

				const result: Stakeholder[] = await response.json();
				setData(result);
			} catch (err) {
				if (err instanceof Error && err.name === 'AbortError') {
					console.log('Запит скасовано:', controller.signal.reason);
					return;
				}
			}
		}

		load(targetUrl);

		return () => {
			controller.abort();
		};
	}, [url]);
}