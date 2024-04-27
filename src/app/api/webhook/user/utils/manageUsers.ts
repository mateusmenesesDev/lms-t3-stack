import { db } from "~/server/db";
import { type UserJSON, type DeletedObjectJSON } from "@clerk/backend";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createUser(user: UserJSON) {
  await delay(10000);
  if (!user.email_addresses[0]?.email_address) {
    throw new Error("No email address found");
  }

  // if (!user.first_name) throw new Error("No first name found");

  // let name: string;

  // switch (user.last_name) {
  //   case undefined:
  //     name = user.first_name;
  //     break;
  //   case "":
  //     name = user.first_name;
  //     break;
  //   default:
  //     name = `${user.first_name} ${user.last_name}`;
  // }

  await db.user.create({
    data: {
      id: user.id,
      email: user.email_addresses[0].email_address,
    },
  });
}

export async function deleteUser(user: DeletedObjectJSON) {
  await db.user.delete({
    where: {
      id: user.id,
    },
  });

  return true;
}

export async function updateUser(user: UserJSON) {
  if (!user.email_addresses[0]?.email_address) {
    throw new Error("No email address found");
  }

  if (!user.first_name) throw new Error("No first name found");

  let name: string;

  switch (user.last_name) {
    case undefined:
      name = user.first_name;
      break;
    case "":
      name = user.first_name;
      break;
    default:
      name = `${user.first_name} ${user.last_name}`;
  }

  const record = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      email: user.email_addresses[0].email_address,
    },
  });
  return record;
}
