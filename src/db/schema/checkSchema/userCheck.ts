import * as user from "../users";

await user.createUserTable();
/**
await user.createUser(
  "sakura.mai@gmail.com",
  "applePieHeart",
  user.userRoleEnum.Admin,
);
*/

console.log(await user.checkAtRegisterEmail("sakura.mai@gmail.com")); // returns userExists 1 or 0
console.table(await user.listUserTablePretty());
// console.log(await user.getIdByEmail("Sasha.Schaden@gmail.com"));
