import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesService {
  findAll() {
    return [
      { id: "cat-1", name: "Transformation digitale", slug: "transformation-digitale" },
      { id: "cat-2", name: "Leadership", slug: "leadership" },
      { id: "cat-3", name: "Data", slug: "data" }
    ];
  }
}
