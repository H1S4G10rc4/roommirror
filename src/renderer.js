const video = document.querySelector('#camera');
const emptyState = document.querySelector('#empty-state');
const status = document.querySelector('#status');
const retryButton = document.querySelector('#retry');
const toolbar = document.querySelector('#toolbar');
const cameraSelect = document.querySelector('#camera-select');
const topToggle = document.querySelector('#top-toggle');
const closeButton = document.querySelector('#close-window');

let stream = null;
let hideTimer = null;
const TOOLBAR_HIDE_DELAY = 2200;

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('room-mirror-settings')) ?? {};
  } catch {
    return {};
  }
}

function saveSettings() {
  localStorage.setItem('room-mirror-settings', JSON.stringify({
    cameraId: cameraSelect.value,
    alwaysOnTop: topToggle.getAttribute('aria-pressed') === 'true',
  }));
}

function stopCamera() {
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
  stream = null;
  video.srcObject = null;
}

function showError(message) {
  status.textContent = message;
  retryButton.hidden = false;
  emptyState.hidden = false;
  video.classList.remove('ready');
}

async function listCameras(selectedId) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === 'videoinput');
  cameraSelect.replaceChildren();

  cameras.forEach((camera, index) => {
    const option = document.createElement('option');
    option.value = camera.deviceId;
    option.textContent = camera.label || `カメラ ${index + 1}`;
    cameraSelect.append(option);
  });

  if (cameras.some((camera) => camera.deviceId === selectedId)) {
    cameraSelect.value = selectedId;
  }
  return cameras;
}

async function startCamera(deviceId) {
  stopCamera();
  status.textContent = 'カメラを準備しています…';
  retryButton.hidden = true;
  emptyState.hidden = false;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: deviceId
        ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
        : { width: { ideal: 1920 }, height: { ideal: 1080 } },
    });
    video.srcObject = stream;
    await video.play();
    await listCameras(stream.getVideoTracks()[0].getSettings().deviceId);
    video.classList.add('ready');
    emptyState.hidden = true;
    saveSettings();
  } catch (error) {
    console.error(error);
    showError('カメラを開始できませんでした。接続状態を確認してください。');
  }
}

function showToolbar() {
  toolbar.classList.remove('hidden');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (toolbar.matches(':hover')) {
      showToolbar();
      return;
    }
    toolbar.classList.add('hidden');
  }, TOOLBAR_HIDE_DELAY);
}

cameraSelect.addEventListener('change', () => startCamera(cameraSelect.value));
retryButton.addEventListener('click', () => startCamera(cameraSelect.value));

topToggle.addEventListener('click', async () => {
  const next = topToggle.getAttribute('aria-pressed') !== 'true';
  const actual = await window.desktop.setAlwaysOnTop(next);
  topToggle.setAttribute('aria-pressed', String(actual));
  saveSettings();
});

closeButton.addEventListener('click', () => window.desktop.closeWindow());

document.addEventListener('mousemove', showToolbar);
window.addEventListener('beforeunload', stopCamera);

async function initialize() {
  const settings = loadSettings();
  const alwaysOnTop = Boolean(settings.alwaysOnTop);
  topToggle.setAttribute('aria-pressed', String(alwaysOnTop));
  await window.desktop.setAlwaysOnTop(alwaysOnTop);
  await startCamera(settings.cameraId);
  showToolbar();
}

initialize();
