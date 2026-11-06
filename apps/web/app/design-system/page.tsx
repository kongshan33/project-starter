import type { Metadata } from "next";
import { Button } from "@starter/ui/button";
import { Input, Textarea } from "@starter/ui/field";

export const metadata: Metadata = { title: "Design system" };
const swatches = ["ink", "text-secondary", "text-muted", "line-strong", "surface-soft", "surface", "brand", "danger"];

export default function DesignSystemPage() {
  return <>
    <section className="hero"><p className="eyebrow">Shared foundations</p><h1>Quiet by design.</h1>
      <p className="lede">A working reference for type, color, controls and feedback.</p></section>
    <section className="catalog-section"><h2>Color</h2><div className="swatches">{swatches.map(token =>
      <div key={token}><div className="swatch" style={{ background: `var(--${token})` }} /><code>{token}</code></div>)}</div></section>
    <section className="catalog-section"><h2>Actions</h2><div className="control-row">
      <Button variant="primary">Primary action</Button><Button>Secondary action</Button><Button variant="ghost">Quiet action</Button>
      <Button variant="danger">Delete item</Button><Button disabled>Unavailable</Button><Button loading loadingLabel="Saving…">Save changes</Button>
    </div><p className="muted">Controls in this reference are examples. The overview contains the working preview.</p></section>
    <section className="catalog-section"><h2>Fields</h2><div className="field-grid">
      <div><label htmlFor="sample-title">Title</label><Input id="sample-title" name="sample-title" placeholder="A clear, short title" /></div>
      <div><label htmlFor="sample-invalid">Title with an error</label><Input id="sample-invalid" name="sample-invalid" aria-invalid="true" aria-describedby="sample-error" defaultValue="" /><p id="sample-error" className="error-message">A title is required.</p></div>
      <div><label htmlFor="sample-description">Description</label><Textarea id="sample-description" name="sample-description" /></div>
      <div><label htmlFor="sample-disabled">Unavailable field</label><Input id="sample-disabled" name="sample-disabled" disabled defaultValue="Read only example" /></div>
    </div></section>
    <section className="catalog-section"><h2>Feedback</h2><div className="field-grid">
      <div className="panel"><h3>Nothing here yet</h3><p className="muted">Explain what will appear, then offer the next useful action.</p></div>
      <div className="panel"><h3>Loading example</h3><div className="ui-skeleton" aria-hidden="true" /><p className="muted">Use a skeleton for missing content; retain existing content during refresh.</p></div>
    </div></section>
  </>;
}
