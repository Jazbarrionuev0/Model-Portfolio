import { getProfileAction } from "@/actions/profile";
import ProfileEdit from "@/components/admin/profile/profile-edit";
import React from "react";

const page = async () => {
  const profile = await getProfileAction();

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto">
      <ProfileEdit profile={profile} />
    </div>
  );
};

export default page;
