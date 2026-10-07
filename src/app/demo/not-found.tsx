import { Button } from "@/components/editorial/ui";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <section className="section align-center">
      <div className="container-fluid">
        <div className="page-title-wrap"><h1 className="page-title">404</h1></div>
        <div className="mb-medium"><p className="paragraph-medium no-indent">That page doesn&rsquo;t exist — it may have moved, or never shipped.</p></div>
        <Button href="/">Back to home</Button>
      </div>
    </section>
  );
}
