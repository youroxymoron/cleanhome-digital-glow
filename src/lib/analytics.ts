const getYmId = () => import.meta.env.VITE_YANDEX_METRIKA_ID;

export function reachYandexGoal(goalId: string) {
  const ymId = getYmId();
  if (!ymId) return;

  const counter = (window as Record<string, unknown>)[`yaCounter${ymId}`] as
    | { reachGoal?: (id: string) => void }
    | undefined;

  if (typeof counter?.reachGoal === "function") {
    counter.reachGoal(goalId);
  }
}

export function reachVkGoal(event: string, goalId?: string) {
  const vk = (window as Record<string, unknown>).VK as
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
