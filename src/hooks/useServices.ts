import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  image_url: string | null;
  full_description: string | null;
  category: string;
}

export const categoryLabels: Record<string, string> = {
  cleaning: "Услуги уборки",
  dry_cleaning: "Услуги химчистки",
  windows: "Услуги мойки окон",
};

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      return data as Service[];
    },
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: ["services", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data as Service[];
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Partial<Service> & { id: string }) => {
      const { error } = await supabase
        .from("services")
        .update(service)
        .eq("id", service.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<Service, "id">) => {
      const { error } = await supabase.from("services").insert(service);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
