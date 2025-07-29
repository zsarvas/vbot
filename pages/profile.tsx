import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Profile: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new profile index page
    router.replace('/profile');
  }, [router]);

  return null;
};

export default Profile;