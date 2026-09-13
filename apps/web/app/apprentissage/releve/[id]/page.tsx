import LearningRecord from "@/components/learning-record";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LearningRecord courseId={id} />;
}
