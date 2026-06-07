import * as apik from "../apiKeys";

await apik.createAPIKeyTable();
// console.log(await apik.getAllKeysById(1));
console.log(await apik.deleteApiKeyById(5, 2));
console.table(await apik.getAllKeys());
