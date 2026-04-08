<div class="ui-overlay">
	<span class="title">📍 Tap & Smash</span>
	<div class="tabs">
		<a href="/" class="tab">🗺️ Map</a>
		<a href="/stats" class="tab">📊 Stats</a>
		<a href="/about" class="tab active">ℹ️ About</a>
	</div>
</div>

<div class="about">
	<h1>What is Tap & Smash?</h1>
	<p>
		Tap & Smash is a real-time world map where people from all over the globe drop a pin at their location with a single tap.
	</p>
	<p>
		No accounts. No profiles. Just you, your location, and a growing map of everyone who's ever smashed their pin into it.
	</p>

	<div class="features">
		<div class="feature">
			<span>💥</span>
			<div>
				<strong>One tap</strong>
				<p>Hit the button and your location is instantly pinned on the map for everyone to see.</p>
			</div>
		</div>
		<div class="feature">
			<span>🌍</span>
			<div>
				<strong>3D Globe</strong>
				<p>Switch to the 3D view and spin the globe to explore pins from every corner of the world.</p>
			</div>
		</div>
		<div class="feature">
			<span>⚡</span>
			<div>
				<strong>Real-time</strong>
				<p>Pins appear live — no refresh needed. Watch the map grow as people smash from around the world.</p>
			</div>
		</div>
		<div class="feature">
			<span>🔒</span>
			<div>
				<strong>Anonymous</strong>
				<p>No sign up, no tracking, no personal data. Just your city and country.</p>
			</div>
		</div>
	</div>

	<a href="/" class="go-btn">💥 Go Smash Your Location</a>
</div>

<style>
	.about {
		width: min(560px, 90vw);
		margin: 7rem auto 2rem;
		background: rgba(15, 15, 26, 0.95);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h1 { font-size: 1.4rem; color: #f72585; margin: 0; }
	p { color: #bbb; font-size: 0.9rem; line-height: 1.6; margin: 0; }

	.features {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		margin-top: 0.5rem;
	}

	.feature { display: flex; gap: 1rem; align-items: flex-start; }
	.feature span { font-size: 1.4rem; }
	.feature strong { display: block; color: #fff; font-size: 0.9rem; margin-bottom: 0.2rem; }
	.feature p { font-size: 0.82rem; }

	.go-btn {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.9rem 2rem;
		background: #f72585;
		color: #fff;
		border-radius: 999px;
		text-decoration: none;
		font-weight: 700;
		font-size: 1rem;
		text-align: center;
		box-shadow: 0 0 24px rgba(247,37,133,0.4);
	}
</style>
