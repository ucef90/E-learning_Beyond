type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="grid">
      {items.map((item) => (
        <details key={item.question} className="card" style={{ padding: 20 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>{item.question}</summary>
          <p className="section-copy" style={{ marginBottom: 0 }}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
