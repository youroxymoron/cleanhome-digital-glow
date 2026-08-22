const getYmId = () => import.meta.env.VITE_YANDEX_METRIKA_ID;

export function reachYandexGoal(goalId: string, params?: Record<string, unknown>) {
  const ymId = getYmId();
  if (!ymId || typeof window === "undefined") return;

  const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;

  if (typeof ym === "function") {
    ym(Number(ymId), "reachGoal", goalId, params);
  }
}

export function reachVkGoal(event: string, goalId?: string) {
  const vk = (window as unknown as Record<string, unknown>).VK as
    | { Go?: (payload?: Record<string, unknown>) => void }
    | undefined;

  if (!vk || typeof vk.Go !== "function") return;

  const payload: Record<string, unknown> = { pixel: { event } };
  if (goalId) {
    (payload.pixel as Record<string, unknown>)["goal_id"] = goalId;
  }

  vk.Go(payload);
}

export function trackConversion(goalId: string, vkEvent = "lead") {
  reachYandexGoal(goalId);
  reachVkGoal(vkEvent, goalId);
}
