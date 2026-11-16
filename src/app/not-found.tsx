import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">The Residence / 404</span>
      <h1>
        A little
        <br />
        <em>off the path.</em>
      </h1>
      <p>We couldn’t find that page.</p>
      <Link className="button" href="/">
        Return to the residence ↗
      </Link>
    </main>
  );
}
