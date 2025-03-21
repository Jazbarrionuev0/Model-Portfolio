import { Profile } from "@/types/profile";

interface ProfileViewProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-6 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-gray-600">{profile.occupation}</p>
          <p className="text-gray-600">{profile.email}</p>
          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{profile.instagram}
            </a>
          )}
        </div>
      </div>
      {profile.description && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{profile.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
