import Link from "next/link";

const links = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/users", "Users"],
  ["/admin/orders", "Orders"],
  ["/admin/truck-types", "Truck Types"],
  ["/admin/ai", "AI"],
  ["/admin/live-map", "Live Map"],
  ["/admin/payments", "Payments"],
];

export function AdminSidebar() {
  return (
    <aside className="w-64 space-y-2 border-r border-white/10 bg-slate-950/80 p-4">
      <p className="mb-4 text-lg font-bold text-cyan-300">Logistika AI Admin</p>
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10">
          {label}
        </Link>
      ))}
    </aside>
  );
}
