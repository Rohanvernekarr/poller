import { getPollResults } from "../../../utils/actions";
import { notFound, redirect } from "next/navigation";
import ResultsUI from "./ResultsUI";

export default async function PollResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const resultsData = await getPollResults(id);
    
    return (
      <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <ResultsUI poll={resultsData} />
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Poll not found") {
      notFound();
    }
    // If unauthorized, redirect to the poll page (where they might see a simple result if public)
    redirect(`/poll/${id}`);
  }
}
