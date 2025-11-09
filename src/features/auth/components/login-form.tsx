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
    <div>
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
          label="Email Address"
        />
        <Input
          name="password"
          type="password"
          label="Password"
        />
        <Button
          isLoading={login.isPending}
          type="submit"
          className="w-full"
        >
          Log in
        </Button>
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <NextLink
            href={paths.auth.forgot_password.getHref(redirectTo)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </NextLink>
        </div>
      </div>
    </div>
  );
};
