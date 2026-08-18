import type { RoutePageProps } from "../../config/navigation";

const FeaturePage = ({ title = "Page" }: RoutePageProps) => (
  <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
    <p className="mt-2 text-sm text-muted-foreground">
      {title} content can be added here.
    </p>

    <div className="mt-6 h-375 w-full rounded-lg border bg-card p-6">
      Scroll Test Content
    </div>
  </section>
);

export default FeaturePage;
