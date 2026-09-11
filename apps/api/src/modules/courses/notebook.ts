import { BadRequestException } from "@nestjs/common";
// Never evaluate submitted code on the application server; discard active MIME/HTML and metadata.
export function cleanNotebook(value: any) {
  if (
    !value ||
    value.nbformat !== 4 ||
    !Array.isArray(value.cells) ||
    value.cells.length < 1 ||
    value.cells.length > 100 ||
    JSON.stringify(value).length > 1500000
  )
    throw new BadRequestException(
      "Notebook .ipynb v4 requis, 100 cellules et 1,5 Mo maximum.",
    );
  const cells = value.cells.map((c: any) => {
    if (!["code", "markdown"].includes(c.cell_type))
      throw new BadRequestException("Type de cellule non pris en charge.");
    if (
      typeof c.source !== "string" &&
      !(
        Array.isArray(c.source) &&
        c.source.every((x: any) => typeof x === "string")
      )
    )
      throw new BadRequestException("Source de cellule invalide.");
    const source = Array.isArray(c.source) ? c.source.join("") : c.source;
    if (source.length > 100000)
      throw new BadRequestException("Cellule trop longue.");
    return c.cell_type === "markdown"
      ? { cell_type: "markdown", metadata: {}, source }
      : {
          cell_type: "code",
          metadata: {},
          source,
          execution_count: null,
          outputs: (Array.isArray(c.outputs) ? c.outputs : [])
            .slice(0, 10)
            .flatMap((o: any) => {
              if (o.output_type === "stream")
                return [
                  {
                    output_type: "stream",
                    name: "stdout",
                    text: String(
                      Array.isArray(o.text) ? o.text.join("") : o.text || "",
                    ).slice(0, 50000),
                  },
                ];
              return [];
            }),
        };
  });
  return {
    nbformat: 4,
    nbformat_minor: 4,
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
    },
    cells,
  };
}
