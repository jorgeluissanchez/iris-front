import { ContentLayout } from "@/components/layouts/content-layout";
import { ProjectListView } from "@/features/jury/components/project-list-view";

const Project = ({ eventId }: { eventId: string }) => {

    return (
        <div className='space-y-6'>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                    Project Jury
                </h1>
                <p className="text-muted-foreground">
                    Review and evaluate projects
                </p>
            </div>
            <ProjectListView eventId={eventId} />
        </div>
    );
};

export default Project;
