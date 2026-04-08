<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db } from '$lib/firebase';
	import {
		collection,
		addDoc,
		onSnapshot,
		serverTimestamp,
		query,
		orderBy
	} from 'firebase/firestore';

	let mapEl: HTMLDivElement;
	let globeEl: HTMLDivElement;
	let status = $state('Getting your location...');
	let pinCount = $state(0);
	let loading = $state(false);
	let view3d = $state(false);
	let myCoords = $state<{ lat: number; lng: number } | null>(null);
	let pins = $state<{ lat: number; lng: number; label: string; city: string; country: string; time: string }[]>([]);
	let unsubscribe: () => void;
	let globeInstance: any = null;

	onMount(async () => {
		const L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');

		const map = L.map(mapEl, { zoomControl: false }).setView([20, 0], 2);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap'
		}).addTo(map);

		L.control.zoom({ position: 'bottomleft' }).addTo(map);

		const pinIcon = L.divIcon({
			className: '',
			html: `<div style="
				width:14px;height:14px;border-radius:50%;
				background:#f72585;border:2px solid #fff;
				box-shadow:0 0 8px rgba(247,37,133,0.8);
				"></div>`,
			iconSize: [14, 14],
			iconAnchor: [7, 7]
		});

		const markers = new Map<string, ReturnType<typeof L.marker>>();

		const q = query(collection(db, 'pins'), orderBy('createdAt', 'desc'));
		unsubscribe = onSnapshot(q, (snapshot) => {
			pinCount = snapshot.size;
			pins = snapshot.docs.map((d) => ({
				lat: d.data().lat,
				lng: d.data().lng,
				label: d.data().label ?? 'Anonymous',
				city: d.data().city ?? 'Unknown',
				country: d.data().country ?? 'Unknown',
				time: d.data().time
			}));
			snapshot.docChanges().forEach((change) => {
				const id = change.doc.id;
				const data = change.doc.data();
				if (change.type === 'added') {
								const m = L.marker([data.lat, data.lng], { icon: pinIcon })
						.addTo(map)
						.bindPopup(`📍 ${data.city ?? 'Unknown'}, ${data.country ?? 'Unknown'}<br><small>${data.time}</small>`);
					markers.set(id, m);
				}
				if (change.type === 'removed') {
					markers.get(id)?.remove();
					markers.delete(id);
				}
			});
			if (globeInstance) globeInstance.pointsData(pins);
		});

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				myCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
				map.setView([myCoords.lat, myCoords.lng], 6);
				status = 'Ready to smash! 👊';
			},
			() => {
				status = 'Location denied — allow it to drop a pin';
			}
		);
	});

	onDestroy(() => unsubscribe?.());

	async function initGlobe() {
		if (globeInstance || !globeEl) return;
		const Globe = (await import('globe.gl')).default;
		globeInstance = Globe()(globeEl)
			.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
			.backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
			.pointsData(pins)
			.pointLat((d: any) => d.lat)
			.pointLng((d: any) => d.lng)
			.pointColor(() => '#f72585')
			.pointAltitude(0.02)
			.pointRadius(0.4)
			.pointLabel((d: any) => `<div style="background:rgba(15,15,26,0.9);padding:6px 10px;border-radius:8px;border:1px solid #f72585;font-size:13px">📍 <b>${d.city}, ${d.country}</b><br><span style="color:#aaa;font-size:11px">${d.time}</span></div>`);
		if (myCoords) {
			globeInstance.pointOfView({ lat: myCoords.lat, lng: myCoords.lng, altitude: 2 }, 1000);
		}
	}

	$effect(() => {
		if (view3d) initGlobe();
	});

	async function smash() {
		if (!myCoords) return;
		loading = true;
		let city = 'Unknown';
		let country = 'Unknown';
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${myCoords.lat}&lon=${myCoords.lng}&format=json`
			);
			const data = await res.json();
			city = data.address?.city ?? data.address?.town ?? data.address?.village ?? data.address?.county ?? 'Unknown';
			country = data.address?.country ?? 'Unknown';
		} catch {}
		await addDoc(collection(db, 'pins'), {
			lat: myCoords.lat,
			lng: myCoords.lng,
			label: 'Anonymous',
			city,
			country,
			time: new Date().toLocaleString(),
			createdAt: serverTimestamp()
		});
		status = `Pin dropped in ${city}! 🎯`;
		loading = false;
	}
</script>

<div bind:this={mapEl} id="map" class:hidden={view3d}></div>
<div bind:this={globeEl} id="globe" class:hidden={!view3d}></div>

<div class="ui-overlay">
	<span class="title">📍 Tap & Smash</span>
	<div class="tabs">
		<a href="/" class="tab active">🗺️ Map</a>
		<a href="/stats" class="tab">📊 Stats</a>
		<a href="/about" class="tab">ℹ️ About</a>
		<button class="tab" onclick={() => (view3d = !view3d)}>{view3d ? '🗺️ 2D' : '🌍 3D'}</button>
	</div>
	<span class="status">{status}</span>
</div>

<div class="pin-count">
	<strong>{pinCount}</strong>
	pins worldwide
</div>

<button class="smash-btn" onclick={smash} disabled={!myCoords || loading}>
	{loading ? 'Dropping...' : '💥 Smash My Location'}
</button>
