import { getProfileAction } from "@/actions/profile";
import ProfileView from "@/components/admin/profile/profile-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
  const profile = await getProfileAction();

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p>Please create a profile to get started.</p>
      </div>
    );
  }

  return (
    <div className=" p-4 md:p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <Link href="/profile/edit">
          <Button>Editar perfil</Button>
        </Link>
      </div>

      <ProfileView profile={profile} />
    </div>
  );
}
