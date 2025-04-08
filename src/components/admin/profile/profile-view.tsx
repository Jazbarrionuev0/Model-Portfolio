import { Profile } from "@/types/profile";
import { User, Mail, Briefcase, Instagram, Info } from "lucide-react";

interface ProfileViewProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-6 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-700" />
            {profile.name}
          </h2>

          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Briefcase className="w-4 h-4 text-gray-500" />
            {profile.occupation}
          </p>

          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4 text-gray-500" />
            {profile.email}
          </p>

          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              className="text-blue-600 hover:underline flex items-center gap-2 mt-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-4 h-4" />@{profile.instagram}
            </a>
          )}
        </div>
      </div>

      {profile.description && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-700" />
            Descripción
          </h3>
          <p className="text-gray-600 whitespace-pre-wrap">{profile.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
