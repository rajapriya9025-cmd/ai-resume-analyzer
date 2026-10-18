<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>InboxHire — Resume Review</title>
	<style>
		:root {
			--ink: #17243b;
			--muted: #78849a;
			--blue: #4f6df5;
			--blue-soft: #edf0ff;
			--green: #168768;
			--green-soft: #e8f7f1;
			--amber: #b7791f;
			--amber-soft: #fff5df;
			--line: #e9edf4;
			--paper: #ffffff;
			--canvas: #f5f7fb;
		}

		* { box-sizing: border-box; }
		body {
			margin: 0;
			min-height: 100vh;
			color: var(--ink);
			background: var(--canvas);
			font: 15px/1.5 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		}
		button, input { font: inherit; }
		.app { min-height: 100vh; }
		.topbar {
			height: 72px;
			padding: 0 6.5%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: var(--paper);
			border-bottom: 1px solid var(--line);
		}
		.brand { display: flex; align-items: center; gap: 11px; font-size: 18px; font-weight: 750; letter-spacing: -.5px; }
		.brand-mark {
			display: grid; place-items: center; width: 36px; height: 36px;
			color: white; background: var(--blue); border-radius: 11px;
			box-shadow: 0 5px 12px #4f6df533;
		}
		.brand-mark svg { width: 20px; }
		.top-note { color: var(--muted); font-size: 13px; }
		main { width: min(1080px, 90%); margin: 50px auto 72px; }
		.intro { text-align: center; margin-bottom: 34px; }
		.eyebrow { color: var(--blue); font-size: 11px; font-weight: 800; letter-spacing: 1.7px; text-transform: uppercase; }
		h1 { margin: 9px 0 8px; font-size: clamp(30px, 4vw, 42px); line-height: 1.15; letter-spacing: -1.8px; }
		.intro p { margin: 0; color: var(--muted); }
		.workspace {
			display: grid; grid-template-columns: minmax(300px, .9fr) minmax(400px, 1.1fr);
			overflow: hidden; background: var(--paper); border: 1px solid var(--line);
			border-radius: 22px; box-shadow: 0 18px 55px #20325a0d;
		}
		.upload-panel { padding: 34px; border-right: 1px solid var(--line); }
		.panel-heading { margin: 0 0 5px; font-size: 17px; letter-spacing: -.3px; }
		.panel-copy { margin: 0 0 24px; color: var(--muted); font-size: 13px; }
		.dropzone {
			position: relative; min-height: 310px; padding: 23px;
			display: flex; flex-direction: column; align-items: center; justify-content: center;
			border: 1.5px dashed #cbd3e4; border-radius: 16px;
			background: linear-gradient(145deg, #fafbff, #f5f7ff);
			transition: .2s ease;
		}
		.dropzone.dragover { border-color: var(--blue); background: #eef1ff; }
		.dropzone.has-file { border-style: solid; border-color: #b9c4ff; }
		.mail-art { position: relative; width: 136px; height: 122px; margin-bottom: 18px; }
		.mail-back { position: absolute; inset: 23px 7px 0; background: #dce3ff; border-radius: 13px; transform: rotate(-5deg); }
		.envelope {
			position: absolute; left: 12px; bottom: 0; width: 112px; height: 76px;
			overflow: hidden; background: #7188fa; border-radius: 9px;
			box-shadow: 0 10px 20px #526ef530;
		}
		.envelope:before, .envelope:after {
			position: absolute; bottom: -25px; width: 78px; height: 78px; content: "";
			background: #8fa0ff; transform: rotate(45deg);
		}
		.envelope:before { left: -31px; }
		.envelope:after { right: -31px; }
		.flap { position: absolute; top: -47px; left: 8px; width: 96px; height: 96px; background: #aab6ff; transform: rotate(45deg); border-radius: 7px; }
		.resume {
			position: absolute; z-index: 1; top: 0; left: 42px; width: 57px; height: 76px;
			padding: 12px 8px; background: white; border-radius: 5px;
			box-shadow: 0 5px 14px #26366520; transform: rotate(4deg);
		}
		.resume:before { display: block; width: 16px; height: 16px; margin-bottom: 8px; content: ""; border-radius: 50%; background: #dce3ff; }
		.resume i { display: block; height: 3px; margin: 4px 0; border-radius: 3px; background: #e1e6f2; }
		.resume i:first-of-type { width: 35px; background: #8799ff; }
		.drop-title { margin: 0 0 4px; font-size: 15px; font-weight: 700; }
		.drop-subtitle { margin: 0; color: var(--muted); font-size: 12px; text-align: center; }
		.browse { color: var(--blue); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
		.file-meta { display: none; max-width: 100%; margin-top: 13px; padding: 7px 11px; overflow: hidden; color: #495776; background: white; border: 1px solid var(--line); border-radius: 9px; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
		.has-file .file-meta { display: block; }
		.privacy { display: flex; gap: 8px; margin: 15px 2px 20px; color: var(--muted); font-size: 11px; }
		.privacy svg { flex: 0 0 15px; margin-top: 1px; color: var(--green); }
		.analyze {
			width: 100%; padding: 13px 18px; color: white; background: var(--blue); border: 0;
			border-radius: 11px; font-weight: 750; cursor: pointer;
			box-shadow: 0 6px 14px #4f6df52b; transition: .2s ease;
		}
		.analyze:hover:not(:disabled) { background: #3e5de8; transform: translateY(-1px); }
		.analyze:disabled { opacity: .48; cursor: not-allowed; box-shadow: none; }
		.results { padding: 34px; background: #fff; }
		.results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 23px; }
		.results-header h2 { margin: 0; font-size: 17px; }
		.demo-tag { padding: 5px 9px; color: #5664b9; background: var(--blue-soft); border-radius: 20px; font-size: 10px; font-weight: 750; letter-spacing: .3px; text-transform: uppercase; }
		.score-card { display: flex; align-items: center; gap: 21px; padding: 20px; background: #f8f9ff; border: 1px solid #edf0ff; border-radius: 15px; }
		.score-ring {
			--score: 0%; position: relative; display: grid; flex: 0 0 86px; width: 86px; height: 86px;
			place-items: center; border-radius: 50%; background: conic-gradient(var(--blue) var(--score), #e7eafe 0);
			transition: background 1s ease;
		}
		.score-ring:before { position: absolute; width: 68px; height: 68px; content: ""; background: #f8f9ff; border-radius: 50%; }
		.score-number { position: relative; font-size: 24px; font-weight: 800; letter-spacing: -1px; }
		.score-number small { font-size: 12px; color: var(--muted); letter-spacing: 0; }
		.score-copy strong { display: block; margin-bottom: 3px; font-size: 14px; }
		.score-copy span { color: var(--muted); font-size: 12px; }
		.section-title { display: flex; align-items: center; justify-content: space-between; margin: 24px 0 11px; font-size: 13px; font-weight: 750; }
		.count { color: var(--muted); font-size: 11px; font-weight: 600; }
		.skills { display: flex; flex-wrap: wrap; gap: 8px; }
		.skill { padding: 7px 10px; border-radius: 8px; font-size: 11px; font-weight: 650; }
		.skill.present { color: var(--green); background: var(--green-soft); }
		.skill.missing { color: var(--amber); background: var(--amber-soft); }
		.empty-state { display: flex; min-height: 365px; flex-direction: column; align-items: center; justify-content: center; padding: 10px 26px; text-align: center; }
		.empty-icon { display: grid; width: 60px; height: 60px; margin-bottom: 14px; place-items: center; color: #8b9cff; background: var(--blue-soft); border-radius: 18px; }
		.empty-icon svg { width: 28px; }
		.empty-state h3 { margin: 0 0 6px; font-size: 15px; }
		.empty-state p { max-width: 270px; margin: 0; color: var(--muted); font-size: 12px; }
		.result-content { display: none; }
		.result-content.visible { display: block; animation: appear .35s ease both; }
		@keyframes appear { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
		.error { display: none; margin-top: 10px; color: #b64747; font-size: 12px; }
		.error.visible { display: block; }
		footer { margin-top: 20px; color: #939db0; text-align: center; font-size: 11px; }
		@media (max-width: 760px) {
			.topbar { height: 64px; padding: 0 5%; }
			main { width: min(560px, 92%); margin: 34px auto 50px; }
			.workspace { grid-template-columns: 1fr; }
			.upload-panel { border-right: 0; border-bottom: 1px solid var(--line); }
			.upload-panel, .results { padding: 26px; }
			.dropzone { min-height: 275px; }
			.empty-state { min-height: 190px; }
		}
		@media (max-width: 420px) {
			.top-note { display: none; }
			.upload-panel, .results { padding: 21px; }
			.score-card { gap: 14px; padding: 15px; }
		}
	</style>
</head>
<body>
	<div class="app">
		<header class="topbar">
			<div class="brand">
				<span class="brand-mark" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none"><path d="M3.5 6.5h17v11h-17z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</span>
				InboxHire
			</div>
			<span class="top-note">A clearer look at your next opportunity</span>
		</header>

		<main>
			<section class="intro">
				<div class="eyebrow">Your resume, reviewed</div>
				<h1>Make your next application count.</h1>
				<p>Drop your resume in the inbox and get a quick skills snapshot.</p>
			</section>

			<section class="workspace" aria-label="Resume analyzer">
				<div class="upload-panel">
					<h2 class="panel-heading">Send your resume</h2>
					<p class="panel-copy">Add a PDF to see your mock review.</p>
					<div class="dropzone" id="dropzone" role="button" tabindex="0" aria-label="Choose or drop a PDF resume">
						<input id="file-input" type="file" accept="application/pdf,.pdf" hidden />
						<div class="mail-art" aria-hidden="true">
							<div class="mail-back"></div>
							<div class="resume"><i></i><i></i><i></i><i></i></div>
							<div class="envelope"><div class="flap"></div></div>
						</div>
						<p class="drop-title">Your resume has a place here</p>
						<p class="drop-subtitle">Drag and drop a PDF, or <span class="browse" id="browse">browse files</span></p>
						<div class="file-meta" id="file-meta"></div>
					</div>
					<div class="privacy">
						<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.5 4 5v4.4c0 3.8 2.6 6.4 6 8.1 3.4-1.7 6-4.3 6-8.1V5l-6-2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="m7.5 9.8 1.7 1.7 3.5-3.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
						<span>Demo only: your file stays in this browser. No real parsing or upload happens.</span>
					</div>
					<button class="analyze" id="analyze" type="button" disabled>Review my resume <span aria-hidden="true">→</span></button>
					<div class="error" id="error" role="alert">Please choose a PDF file to continue.</div>
				</div>

				<div class="results">
					<div class="results-header">
						<h2>Your resume snapshot</h2>
						<span class="demo-tag">Demo preview</span>
					</div>
					<div class="empty-state" id="empty-state">
						<div class="empty-icon" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none"><path d="M6 3.5h8l4 4v13H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3.5v5h5M8 13h8M8 16.5h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</div>
						<h3>Nothing in the inbox yet</h3>
						<p>Choose a PDF and we'll show a sample score, matched skills, and skills to add.</p>
					</div>
					<div class="result-content" id="result-content" aria-live="polite">
						<div class="score-card">
							<div class="score-ring" id="score-ring"><span class="score-number"><span id="score-number">0</span><small>/100</small></span></div>
							<div class="score-copy"><strong>Resume match score</strong><span>Good foundation — a few skills could strengthen your profile.</span></div>
						</div>
						<div class="section-title">Skills present <span class="count">4 found</span></div>
						<div class="skills">
							<span class="skill present">✓ JavaScript</span><span class="skill present">✓ HTML &amp; CSS</span>
							<span class="skill present">✓ Communication</span><span class="skill present">✓ Problem solving</span>
						</div>
						<div class="section-title">Skills to consider adding <span class="count">3 suggested</span></div>
						<div class="skills">
							<span class="skill missing">＋ TypeScript</span><span class="skill missing">＋ Testing</span>
							<span class="skill missing">＋ Accessibility</span>
						</div>
					</div>
				</div>
			</section>
			<footer>InboxHire is a visual demo. The score and skills are sample results, not extracted from your PDF.</footer>
		</main>
	</div>

	<script>
		const dropzone = document.getElementById('dropzone');
		const fileInput = document.getElementById('file-input');
		const fileMeta = document.getElementById('file-meta');
		const analyzeButton = document.getElementById('analyze');
		const errorMessage = document.getElementById('error');
		let selectedFile = null;

		function setFile(file) {
			errorMessage.classList.remove('visible');
			if (!file) return;
			if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
				selectedFile = null;
				dropzone.classList.remove('has-file');
				fileMeta.textContent = '';
				analyzeButton.disabled = true;
				errorMessage.textContent = 'Please choose a PDF file.';
				errorMessage.classList.add('visible');
				return;
			}
			selectedFile = file;
			dropzone.classList.add('has-file');
			fileMeta.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
			analyzeButton.disabled = false;
		}

		document.getElementById('browse').addEventListener('click', (event) => {
			event.stopPropagation();
			fileInput.click();
		});
		dropzone.addEventListener('click', (event) => {
			if (!event.target.closest('#browse')) fileInput.click();
		});
		dropzone.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				fileInput.click();
			}
		});
		fileInput.addEventListener('change', () => setFile(fileInput.files[0]));
		['dragenter', 'dragover'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
			event.preventDefault();
			dropzone.classList.add('dragover');
		}));
		['dragleave', 'drop'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
			event.preventDefault();
			dropzone.classList.remove('dragover');
		}));
		dropzone.addEventListener('drop', (event) => setFile(event.dataTransfer.files[0]));

		analyzeButton.addEventListener('click', () => {
			if (!selectedFile) {
				errorMessage.textContent = 'Please choose a PDF file to continue.';
				errorMessage.classList.add('visible');
				return;
			}
			analyzeButton.disabled = true;
			analyzeButton.textContent = 'Reviewing…';
			window.setTimeout(() => {
				document.getElementById('empty-state').style.display = 'none';
				document.getElementById('result-content').classList.add('visible');
				document.getElementById('score-number').textContent = '82';
				document.getElementById('score-ring').style.setProperty('--score', '82%');
				analyzeButton.innerHTML = 'Review another resume <span aria-hidden="true">→</span>';
				analyzeButton.disabled = false;
			}, 650);
		});
	</script>
</body>
</html>
