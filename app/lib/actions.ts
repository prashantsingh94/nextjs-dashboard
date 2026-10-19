"use server";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // Implement the logic to create an invoice using the formData
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  // Test it out:
  //console.log({ customerId, amount, status });
  //console.log(typeof amount);
  const amountInCents = amount * 100; // Convert the amount to cents
  const date = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }
  revalidatePath("/dashboard/invoices"); // Revalidate the invoices page to reflect the new invoice
  redirect("/dashboard/invoices"); // Redirect to the invoices page after creation
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true }); // Omit id and date for updating an invoice

export async function updateInvoice(id: string, formData: FormData) {
  // Parse and validate the form data for updating an invoice
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
// Delete an invoice by ID
export async function deleteInvoice(id: string) {
  //throw new Error("Failed to Delete Invoice");

  // Implement the logic to delete an invoice by its ID
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
