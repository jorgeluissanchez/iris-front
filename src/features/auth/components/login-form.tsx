'use client';

import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { paths } from '@/config/paths';
import { useLogin, loginInputSchema } from '@/lib/auth';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({
    onSuccess,
  });

  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo');
  return (
    <div className="space-y-4">
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);
          const values = await loginInputSchema.parseAsync(data);
          await login.mutateAsync(values);
        }}
      >
        <Input
          name="email"
          type="email"
          label="Correo electrónico"
          placeholder="tu@correo.com"
          isRequired
        />
        <Input
          name="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          isRequired
        />
        <div className="flex items-center justify-end mb-2">
          <NextLink
            href={paths.auth.forgot_password.getHref(redirectTo)}
            className="text-sm font-medium text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </NextLink>
        </div>
        <Button
          isLoading={login.isPending}
          type="submit"
          className="w-full"
        >
          Iniciar sesión
        </Button>
      </Form>
    </div>
  );
};
