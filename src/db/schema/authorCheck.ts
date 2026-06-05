import * as author from "./authors";

await author.createAuthorTable();
console.log("\n\n");
console.table(await author.listAllAuthor());
