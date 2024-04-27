import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { deleteUser, updateUser } from "./utils/manageUsers";
import { env } from "~/env";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = (await req.json()) as WebhookEvent;
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  try {
    // This is the ID used for testing purposes on Clerk
    if (evt.data.id === "user_29w83sxmDNGwOuEthce5gg56FcC") {
      return Response.json({
        success: true,
        eventType: evt.type,
        testing: true,
      });
    }

    // Handle the event
    switch (evt.type) {
      case "user.updated":
        await updateUser(evt.data);
        break;
      case "user.deleted":
        await deleteUser(evt.data);
        break;
      default:
        console.log("Unhandled event:", evt);
    }

    return Response.json({ success: true, eventType: evt.type });
  } catch (err) {
    console.error("Error handling event:", err);
    return Response.json(
      { success: false, eventType: evt.type },
      { status: 500 },
    );
  }
}
