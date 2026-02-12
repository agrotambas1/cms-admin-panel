import { CardArticle } from "./_components/card-article";
import { CardCaseStudy } from "./_components/card-case-study";
import { CardEvent } from "./_components/card-event";

export default function DashboardPage() {
  return (
    <div className="space-y-4 w-full">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CardCaseStudy />
        <CardArticle />
        <CardEvent />
      </div>
    </div>
  );
}
