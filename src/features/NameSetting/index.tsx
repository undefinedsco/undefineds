'use client';

import {
  getSolidDataset,
  getThing,
  saveSolidDatasetAt,
  setStringNoLocale,
  setThing,
} from '@inrupt/solid-client';
import { useSession } from '@inrupt/solid-ui-react';
import { VCARD } from '@inrupt/vocab-common-rdf';
import { Input } from '@lobehub/ui';
import { memo, useEffect, useState } from 'react';

// import { useSolidSession } from '@/hooks/useSolidSession';
import { useSolidStore } from '@/store/solid';

// import { EditOutlined } from '@ant-design/icons';

const UpdateName = memo(() => {
  const { session } = useSession();
  // const { refresh, user } = useSolidSession();
  const [user, setUser] = useSolidStore((state) => [state.user, state.setUser]);
  const [name, setName] = useState<string | null>(user?.name || null);

  useEffect(() => {
    setName(user?.name || null);
  }, [user?.name]);

  const updateSolidName = async () => {
    if (!session?.info.webId || !name) return;

    try {
      const profileDataset = await getSolidDataset(session.info.webId, { fetch: session.fetch });
      if (!profileDataset) {
        throw new Error('Failed to get profile dataset');
      }
      const profileThing = getThing(profileDataset, session.info.webId);
      if (!profileThing) {
        throw new Error('Failed to get profile thing');
      }
      const updatedProfile = setStringNoLocale(profileThing, VCARD.fn, name);
      const updatedDataset = setThing(profileDataset, updatedProfile);

      await saveSolidDatasetAt(session.info.webId, updatedDataset, { fetch: session.fetch });
      setUser({ ...user, name: name });
      console.log('Updated full name successfully', name);
    } catch (error) {
      console.error('Failed to update full name:', error);
    }
  };

  const handleBlur = () => {
    updateSolidName();
  };

  return (
    <Input
      autoFocus
      onBlur={handleBlur}
      onChange={(e) => setName(e.target.value)}
      style={{ textAlign: 'right' }}
      value={name || ''}
    />
  );
});

export default UpdateName;
