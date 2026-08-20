import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "Некорректный email" }).max(255),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать минимум 8 символов" })
    .max(72),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast({
        title: "Проверьте данные",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setIsLoading(false);

      if (error) {
        toast({
          title: "Не удалось создать аккаунт",
          description: "Проверьте данные или попробуйте войти",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Аккаунт создан",
        description:
          "Права администратора выдаются владельцем сайта отдельно.",
      });
      setIsSignUp(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setIsLoading(false);

    if (error) {
      toast({
        title: "Не удалось войти",
        description: "Неверный email или пароль",
        variant: "destructive",
      });
      return;
    }

    navigate("/admin", { replace: true });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle>Вход в панель управления</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Пароль
              </label>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={72}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
