import { Gem, Mail, MapPin, MessageCircle, Phone, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORE } from '@/lib/constants';

export function About() {
  return (
    <div className="container-page max-w-4xl space-y-8 py-10">
      <header className="text-center">
        <span className="chip bg-brand-50 text-brand-700">Our story</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
          Jewellery made by hand in Gangakhed
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-700">
          {STORE.name} started as a small family workshop making bridal sets for weddings in our own
          town. Today we ship all over India, but every piece still passes through the same hands
          before it is packed.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Gem, title: 'Real craft', copy: 'Stones are hand set, not glued. Each piece is polished individually.' },
          { icon: Sparkles, title: 'Honest pricing', copy: 'Workshop to you, with no showroom margin added on top.' },
          { icon: Truck, title: 'Safe delivery', copy: 'Bubble wrapped, boxed and tracked from our door to yours.' },
        ].map((item) => (
          <div key={item.title} className="card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <item.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-display text-lg font-bold">{item.title}</h2>
            <p className="mt-1 text-sm text-ink-700">{item.copy}</p>
          </div>
        ))}
      </div>

      <div className="card grid gap-6 overflow-hidden sm:grid-cols-2">
        <img src="/images/products/set-2.jpeg" alt="" className="h-full w-full object-cover" />
        <div className="p-8">
          <h2 className="font-display text-2xl font-bold">What we make</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Kundan and polki bridal sets, antique temple jewellery, kolhapuri saaj, oxidised silver,
            jhumkas, bangles, rings and anklets — pieces meant for weddings, festivals and everyday
            wear alike.
          </p>
          <Link to="/shop" className="btn-primary mt-5">
            Browse the collection
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="container-page max-w-4xl py-10">
      <header className="text-center">
        <span className="chip bg-brand-50 text-brand-700">We are here to help</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-4xl">Contact us</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-700">
          Questions about an order, a custom bridal set, or bulk enquiries — reach out and we will
          reply within one working day.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Phone, label: 'Call us', value: STORE.phone },
          { icon: Mail, label: 'Email', value: STORE.email },
          { icon: MapPin, label: 'Workshop', value: STORE.address },
        ].map((item) => (
          <div key={item.label} className="card p-6 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <item.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium text-ink-900">{item.value}</p>
          </div>
        ))}
      </div>

      <form
        className="card mt-6 space-y-4 p-8"
        onSubmit={(event) => {
          event.preventDefault();
          alert('Thank you! We will get back to you shortly.');
        }}
      >
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <MessageCircle className="h-5 w-5 text-brand-700" /> Send us a message
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="contact-name">
              Your name
            </label>
            <input id="contact-name" required className="field" placeholder="Priya Sharma" />
          </div>
          <div>
            <label className="label" htmlFor="contact-phone">
              Mobile number
            </label>
            <input id="contact-phone" required className="field" placeholder="9876543210" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="contact-message">
            Message
          </label>
          <textarea id="contact-message" required rows={4} className="field resize-none" />
        </div>
        <button className="btn-primary">Send message</button>
      </form>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-6xl font-bold text-brand-200">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink-900">
        This page slipped out of the jewellery box
      </h1>
      <p className="mt-2 text-sm text-ink-500">The link may be old or the piece may have sold out.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
