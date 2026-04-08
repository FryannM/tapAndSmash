<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db } from '$lib/firebase';
	import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

	type CityEntry = { city: string; country: string; count: number };

	let allPins = $state<{ city: string; country: string }[]>([]);
	let search = $state('');
	let unsubscribe: () => void;

	onMount(() => {
		const q = query(collection(db, 'pins'), orderBy('createdAt', 'desc'));
		unsubscribe = onSnapshot(q, (snapshot) => {
			allPins = snapshot.docs.map((d) => ({
				city: d.data().city ?? 'Unknown',
				country: d.data().country ?? 'Unknown'
			}));
		});
	});

	onDestroy(() => unsubscribe?.());

	let cityStats = $derived.by(() => {
		const map = new Map<string, CityEntry>();
		for (const pin of allPins) {
			const key = `${pin.city}||${pin.country}`;
			const entry = map.get(key) ?? { city: pin.city, country: pin.country, count: 0 };
			entry.count++;
			map.set(key, entry);
		}
		return [...map.values()].sort((a, b) => b.count - a.count);
	});

	let filtered = $derived(
		search.trim()
			? cityStats.filter((e) =>
					e.city.toLowerCase().includes(search.toLowerCase()) ||
					e.country.toLowerCase().includes(search.toLowerCase())
			  )
			: cityStats
	);
</script>

<div class="stats-page">
	<div class="ui-overlay">
		<span class="title">📍 Tap & Smash</span>
		<div class="tabs">
			<a href="/" class="tab">🗺️ Map</a>
			<a href="/stats" class="tab active">📊 Stats</a>
			<a href="/about" class="tab">ℹ️ About</a>
		</div>
	</div>

	<div class="stats-content">
		<div class="stats-header">
			<div>
				<h1>City Leaderboard</h1>
				<p class="sub">{allPins.length} total pins across {cityStats.length} cities</p>
			</div>
		</div>

		<input
			class="search"
			type="text"
			placeholder="🔍 Filter by city or country..."
			bind:value={search}
		/>

		{#if filtered.length === 0}
			<p class="empty">No results found.</p>
		{:else}
			<div class="list">
				{#each filtered as entry, i}
					<div class="city-row">
						<span class="rank">#{i + 1}</span>
						<div class="city-info">
							<span class="city-name">{entry.city}</span>
							<span class="country">{entry.country}</span>
						</div>
						<div class="bar-wrap">
							<div
								class="bar"
								style="width: {Math.round((entry.count / filtered[0].count) * 100)}%"
							></div>
						</div>
						<span class="count">{entry.count} {entry.count === 1 ? 'pin' : 'pins'}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.stats-page {
		background: #0f0f1a;
		min-height: 100dvh;
		color: #fff;
	}

	.stats-content {
		max-width: 640px;
		margin: 0 auto;
		padding: 7rem 1rem 2rem;
	}

	.stats-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1.25rem;
	}

	h1 {
		font-size: 1.3rem;
		color: #f72585;
	}

	.sub {
		font-size: 0.8rem;
		color: #666;
		margin-top: 0.2rem;
	}

	.search {
		width: 100%;
		padding: 0.65rem 1rem;
		border-radius: 10px;
		border: 1px solid rgba(255,255,255,0.1);
		background: rgba(255,255,255,0.05);
		color: #fff;
		font-size: 0.9rem;
		margin-bottom: 1rem;
		outline: none;
	}

	.search:focus { border-color: #f72585; }
	.search::placeholder { color: #555; }

	.list { display: flex; flex-direction: column; gap: 0.5rem; }

	.city-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.07);
		border-radius: 10px;
		padding: 0.75rem 1rem;
	}

	.rank {
		font-size: 0.75rem;
		color: #555;
		width: 2rem;
		flex-shrink: 0;
	}

	.city-info {
		display: flex;
		flex-direction: column;
		min-width: 120px;
	}

	.city-name { font-size: 0.95rem; font-weight: 600; }
	.country { font-size: 0.75rem; color: #888; }

	.bar-wrap {
		flex: 1;
		background: rgba(255,255,255,0.06);
		border-radius: 999px;
		height: 6px;
		overflow: hidden;
	}

	.bar {
		height: 100%;
		background: #f72585;
		border-radius: 999px;
		transition: width 0.4s ease;
	}

	.count {
		font-size: 0.8rem;
		color: #f72585;
		font-weight: 700;
		min-width: 50px;
		text-align: right;
	}

	.empty { color: #555; text-align: center; padding: 3rem 0; }
</style>
