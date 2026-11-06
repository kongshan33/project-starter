import project from "../../../project.json";
import { PreviewForm } from "@/features/preview/PreviewForm";

export default function HomePage() {
  return <>
    <section className="hero"><p className="eyebrow">Your next project</p><h1>A place to start.<br />Room to make it yours.</h1>
      <p className="lede">{project.description}</p>
    </section>
    <section className="workspace-grid" aria-label="Project workspace">
      <div className="panel"><p className="eyebrow">Try the workspace</p><h2>Start with an idea</h2>
        <p className="muted">Give your idea a short title to preview it. Nothing is saved.</p><PreviewForm />
      </div>
      <aside className="notes"><h2>Make it your own</h2><ol>
        <li><strong>Define the purpose</strong><p>Who is this for, and what should they be able to do?</p></li>
        <li><strong>Build one useful flow</strong><p>Start small, with a clear result people can try.</p></li>
        <li><strong>Keep the details consistent</strong><p>Use the shared controls and make every state understandable.</p></li>
      </ol></aside>
    </section>
  </>;
}
