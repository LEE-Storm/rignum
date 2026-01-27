export function DisclaimerBanner() {
  return (
    <section className="rounded-2xl border p-4 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Mission</h2>
        <p className="text-sm text-muted-foreground">
          Rignum is an automated index of publicly available market discussions and references.
          It catalogs links and metadata only, without hosting or reproducing third-party content.
        </p>
        <a className="text-sm underline" href="/disclaimer">
          Learn more
        </a>
      </div>

      <div className="pt-2 border-t">
        <h2 className="text-lg font-semibold">Short Disclaimer</h2>
        <p className="text-sm text-muted-foreground">
          The Service displays unverified, user-generated or third-party references collected automatically.
          Nothing here is financial advice, a recommendation, or a forecast.
        </p>
        <a className="text-sm underline" href="/disclaimer">
          We strongly recommend you open the full disclaimer
        </a>
      </div>
    </section>
  );
}
