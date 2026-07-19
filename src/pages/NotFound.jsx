import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
      <h2 className="text-3xl font-semibold">Page not found</h2>
      <p className="type-label text-cyan-300">404</p>
      <h2 className="text-3xl font-semibold text-white">Page not found</h2>
      <Link className="mt-4 inline-flex rounded-full bg-cyan-400 px-5 py-2 font-semibold text-slate-950" to="/">
        Go home
      </Link>
    </section>
  );
}
