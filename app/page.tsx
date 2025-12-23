import { AgendaProvider } from './_providers/AgendaProvider';
import { AgendaInput } from './_components/agenda/AgendaInput';
import { RoleDisplay } from './_components/agenda/RoleDisplay';

export default function Home() {
  return (
    <AgendaProvider>
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-white">RoleCopilot Agenda Processor</h1>
        <div className="w-full max-w-2xl space-y-8">
          <AgendaInput />
          <RoleDisplay />
        </div>
      </div>
    </AgendaProvider>
  );
}
