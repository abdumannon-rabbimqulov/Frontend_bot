import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck } from 'lucide-react';

import { drivers, buildWsUrl } from '../lib/api.js';

const TASHKENT = [41.3111, 69.2406];

const truckIcon = L.divIcon({
  className: 'driver-marker',
  html: `<div style="width:32px;height:32px;border-radius:12px;border:2px solid #38bdf8;background:rgba(56,189,248,0.25);display:flex;align-items:center;justify-content:center;color:#fff;backdrop-filter:blur(6px);box-shadow:0 0 18px rgba(56,189,248,0.45);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function FitToMarkers({ items }) {
  const map = useMap();
  useEffect(() => {
    if (!items.length) return;
    const bounds = L.latLngBounds(items.map((it) => [it.lat, it.lon]));
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);
  return null;
}

export default function LiveMonitoring() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    drivers.locations().then((data) => {
      if (!cancelled) setItems(Array.isArray(data) ? data : []);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const url = buildWsUrl('/admin/drivers/locations/stream');
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.event === 'snapshot' && Array.isArray(data.items)) {
          setItems(data.items);
        } else if (data.event === 'update' && data.item) {
          setItems((prev) => {
            const others = prev.filter((p) => p.driver_id !== data.item.driver_id);
            return [...others, data.item];
          });
        }
      } catch {
        // ignore invalid frames
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(b.ts) - new Date(a.ts)),
    [items],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('live.title')}</h2>
        <span className={`badge ${connected ? 'badge-success' : 'badge-muted'}`}>
          <span
            className={`h-2 w-2 rounded-full ${connected ? 'bg-success' : 'bg-muted'}`}
          />
          WebSocket
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="panel overflow-hidden" style={{ minHeight: 520 }}>
          <MapContainer
            center={TASHKENT}
            zoom={6}
            style={{ height: 520, width: '100%' }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitToMarkers items={sorted} />
            {sorted.map((it) => (
              <Marker
                key={it.driver_id}
                position={[it.lat, it.lon]}
                icon={truckIcon}
                eventHandlers={{ click: () => setSelected(it) }}
              >
                <Popup>
                  <p className="text-sm font-semibold">{it.full_name || `Driver #${it.driver_id}`}</p>
                  <p className="text-xs">{it.truck_number || '—'}</p>
                  <p className="text-[11px] text-muted">{new Date(it.ts).toLocaleString()}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <aside className="panel panel-pad space-y-3">
          <h3 className="text-sm font-semibold text-muted">
            {t('live.online')}: <span className="text-white">{sorted.length}</span>
          </h3>
          {selected ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-semibold">{selected.full_name || `Driver #${selected.driver_id}`}</p>
                  <p className="text-xs text-muted">#{selected.driver_id}</p>
                </div>
              </div>
              <Field label={t('live.truck')} value={selected.truck_number || '—'} />
              <Field label="Lat / Lon" value={`${selected.lat.toFixed(5)}, ${selected.lon.toFixed(5)}`} />
              <Field label={t('live.lastUpdate')} value={new Date(selected.ts).toLocaleString()} />
              {selected.expires_at && (
                <Field label="Expires" value={new Date(selected.expires_at).toLocaleString()} />
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">{t('live.noSelection')}</p>
          )}

          <hr className="border-white/5" />
          <ul className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
            {sorted.map((it) => (
              <li
                key={it.driver_id}
                onClick={() => setSelected(it)}
                className={`cursor-pointer rounded-xl border px-2.5 py-2 text-sm ${
                  selected?.driver_id === it.driver_id
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <p className="font-medium">{it.full_name || `Driver #${it.driver_id}`}</p>
                <p className="text-[11px] text-muted">{it.truck_number || '—'}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
