'use client';

import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { paths } from '@/config/paths';
import { useRegister, registerInputSchema } from '@/lib/auth';
import { Team } from '@/types/api';

type RegisterFormProps = {
  onSuccess: () => void;
  chooseTeam: boolean;
  setChooseTeam: () => void;
  teams?: Team[];
};

export const RegisterForm = ({
  onSuccess,
  chooseTeam,
  setChooseTeam,
  teams,
}: RegisterFormProps) => {
  const registering = useRegister({ onSuccess });
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
          const values = await registerInputSchema.parseAsync(data);
          await registering.mutateAsync(values);
        }}
      >
            <Input
              name="firstName"
              type="text"
              label="First Name"
            />
            <Input
              name="lastName"
              type="text"
              label="Last Name"
            />
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

            <div className="flex items-center space-x-2">
              <Switch
                isSelected={chooseTeam}
                onValueChange={setChooseTeam}
                className={`${
                  chooseTeam ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
                id="choose-team"
              />
              <label htmlFor="choose-team">Join Existing Team</label>
            </div>

            {chooseTeam && teams ? (
              <Select name="teamId" label="Team">
                {teams?.map((team) => (
                  <SelectItem key={team.id}>{team.name}</SelectItem>
                ))}
              </Select>
            ) : (
              <Input
                name="teamName"
                type="text"
                label="Team Name"
              />
            )}
            <div>
              <Button
                isLoading={registering.isPending}
                type="submit"
                className="w-full"
              >
                Register
              </Button>
            </div>
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <NextLink
            href={paths.auth.login.getHref(redirectTo)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </NextLink>
        </div>
      </div>
    </div>
  );
};
