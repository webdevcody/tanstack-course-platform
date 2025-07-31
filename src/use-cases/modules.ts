import {
  getModules,
  getModuleByTitle,
  createModule,
  getModulesWithSegments,
  reorderModules,
  deleteModule,
} from "~/data-access/modules";
import type { ModuleCreate } from "~/db/schema";

export async function getModulesUseCase() {
  return getModules();
}

export async function createModuleUseCase(module: ModuleCreate) {
  return createModule(module);
}

export async function getOrCreateModuleUseCase(title: string) {
  const existingModule = await getModuleByTitle(title);
  if (existingModule) {
    return existingModule;
  }

  // Get all modules to determine the next order number
  const modules = await getModules();
  const maxOrder = modules.reduce(
    (max, module) => Math.max(max, module.order),
    -1
  );
  const nextOrder = maxOrder + 1;

  return createModule({ title, order: nextOrder });
}

export async function getModulesWithSegmentsUseCase() {
  const modulesWithSegments = await getModulesWithSegments();

  // Sort segments within each module by order
  return modulesWithSegments.map((module) => ({
    ...module,
    segments: module.segments.sort((a, b) => a.order - b.order),
  }));
}

export async function reorderModulesUseCase(
  updates: { id: number; order: number }[]
) {
  return reorderModules(updates);
}

export async function deleteModuleUseCase(moduleId: number) {
  return deleteModule(moduleId);
}
