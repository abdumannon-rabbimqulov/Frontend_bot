import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import DriverLayout from '../components/DriverLayout';

export default function ActiveTrip() {
  const nav = useNavigate();

  // Mock coordinates (Tashkent to Bukhara approx)
  const positions = [[41.2995, 69.2401], [40.1105, 65.3631]];

  return (
    <DriverLayout>
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="font-bold">Toshkent → Buxoro</div>
            <div className="text-xs text-muted">Rejs #2024-0512 • 585 km</div>
          </div>
          <div className="text-right text-xs">
            <div className="text-success font-semibold">2 soat 15 daqiqa</div>
            <div>ETA 17:45</div>
          </div>
        </div>

        {/* Map */}
        <div className="h-[280px] rounded-3xl overflow-hidden border border-border mt-2">
          <MapContainer center={[40.8, 67.3]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={positions} color="#38bdf8" weight={5} />
            <Marker position={positions[0]} />
            <Marker position={positions[1]} />
          </MapContainer>
        </div>

        <div className="mt-4 panel p-4 text-sm">
          <div className="flex justify-between mb-3">
            <div><span className="text-muted">Hozirgi joy</span><br />Navoiy, 245 km</div>
            <div className="text-right"><span className="text-muted">Qolgan</span><br />340 km</div>
          </div>
          <button onClick={() => alert('Status yangilandi: Yuk tushirildi')} className="btn-primary w-full">Status yangilash</button>
        </div>

        <div className="mt-3 text-center">
          <button onClick={() => nav('/chat')} className="text-xs text-primary">Mijoz bilan chat ochish</button>
        </div>
      </div>
    </DriverLayout>
  );
}
