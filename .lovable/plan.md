## Goal
Upgrade the **Device Management** page (`/dashboard/devices`) so every uploaded photo is captured, instantly displayed, kept in a per-device history with a clean (clear) action, and announces each new capture with a notice.

## Changes (frontend only — `src/pages/dashboard/Devices.tsx`)

### 1. Always-capture + instant display
- After a successful `esp32-ingest` upload, immediately set a `lastCapture` state per device `{ image_url, predicted_class, confidence, is_healthy, created_at }` so the new image appears in the card without waiting for the realtime refresh.
- Show a large "Latest capture" preview inside each device card (image + disease badge + confidence + timestamp).
- Keep the hidden `<input capture="environment">` so each click opens the camera/file picker and every chosen image is uploaded (no dedup, no skip).

### 2. Capture notice
- On every new prediction (detected by watching `predictions` from `usePredictions` for a new `id` belonging to that device), show a toast: "New leaf image captured from {device_id} → {predicted_class} ({confidence%})".
- Also render an inline banner above the gallery for ~5s: "New capture received" with the disease name, auto-dismissing.

### 3. Per-device history with Clean button
- For each device card, list its captures (thumbnails, newest first, max ~12) derived from `usePredictions(100)` filtered by `device_id`.
- Add a **Clear history** button on each card (and a global **Clear all captures** button on the All Captures card).
- Clearing is a UI-only hide: store hidden prediction IDs in `localStorage` (`devices.hiddenPredictionIds`) and filter them out everywhere on the page. No DB delete (table denies DELETE per current RLS).
- Confirm with an `AlertDialog` before clearing.

### 4. UI polish
- Reorganize each device card:
  - Header (name, status, last sync, captures count)
  - Latest capture preview
  - Upload button + Clear history button (side by side)
  - Per-device history thumbnail strip
- Keep the existing "All Captures" gallery below, respecting the hidden-IDs filter, with its own Clear all button.
- Bilingual labels via `useLanguage()` for new strings (English + Bangla) consistent with the rest of the dashboard.

## Out of scope
- No edge-function changes (capture/upload pipeline already works).
- No DB schema or RLS changes (history "clean" is a local hide, since predictions table denies DELETE).
- No ESP32-CAM firmware changes.
