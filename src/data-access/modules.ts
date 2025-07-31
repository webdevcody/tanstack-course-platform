import { database } from "~/db";
import { modules, segments } from "~/db/schema";
import { eq } from "drizzle-orm";
import type { Module, ModuleCreate } from "~/db/schema";

export async function getModules() {
  return database.select().from(modules).orderBy(modules.order);
}

export async function getModuleById(id: Module["id"]) {
  const result = await database.query.modules.findFirst({
    where: eq(modules.id, id),
  });
  return result;
}

export async function createModule(module: ModuleCreate) {
  const result = await database.insert(modules).values(module).returning();
  return result[0];
}

export async function getModuleByTitle(title: string) {
  const result = await database
    .select()
    .from(modules)
    .where(eq(modules.title, title))
    .limit(1);
  return result[0];
}

export async function getModulesWithSegments() {
  return database.query.modules.findMany({
    with: { segments: true },
    orderBy: modules.order,
  });
}

export async function updateModuleOrder(moduleId: number, newOrder: number) {
  return database
    .update(modules)
    .set({ order: newOrder, updatedAt: new Date() })
    .where(eq(modules.id, moduleId))
    .returning();
}

export async function reorderModules(updates: { id: number; order: number }[]) {
  // Use a transaction to ensure all updates happen together
  return database.transaction(async (tx) => {
    const results = [];
    for (const update of updates) {
      const [result] = await tx
        .update(modules)
        .set({ order: update.order, updatedAt: new Date() })
        .where(eq(modules.id, update.id))
        .returning();
      results.push(result);
    }
    return results;
  });
}

export async function deleteModule(moduleId: number) {
  return database.delete(modules).where(eq(modules.id, moduleId));
}
