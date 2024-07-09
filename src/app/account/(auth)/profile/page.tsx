import ProfileForm from "@/components/profile/profile-form";
import ProfilePic from "@/components/profile/profile-pic";
import ProfileSkeleton from "@/components/skeleton/profile-skeleton";
import { getUser } from "@/lib/lucia";
import { Suspense } from "react";

const Profile = async () => {
  const { user } = await getUser();

  return (
    <div className="flex flex-col items-center md:flex-row lg:gap-40 md:gap-20">
      <div className="w-1/2 flex justify-center items-center">
        <ProfilePic firstName={user?.firstName} lastName={user?.lastName} />
      </div>
      <ProfileForm
        user={{
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          address: user?.address,
          phoneNumber: user?.phoneNumber,
        }}
      />
    </div>
  );
};

export default function ProfilePage() {
  return (
    <>
      <h1 className="md:my-5 my-2 text-2xl font-bold">Profile</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>
    </>
  );
}
