'use client';

import {
  getSolidDataset,
  getThing,
  saveSolidDatasetAt,
  setThing,
  setUrl,
} from '@inrupt/solid-client';
import type { Session } from '@inrupt/solid-client-authn-browser';
import { useSession } from '@inrupt/solid-ui-react';
import { VCARD } from '@inrupt/vocab-common-rdf';
import { Upload } from 'antd';
import { memo } from 'react';

import { avatars_container } from '@/const/solid';
import { useSolidStore } from '@/store/solid';
import { useUserStore } from '@/store/user';

import UserAvatar, { type UserAvatarProps } from '../User/UserAvatar';

interface AvatarWithUploadProps extends UserAvatarProps {
  compressSize?: number;
}

const uploadFile = async (session: Session, file: File, destinationUrl: string) => {
  console.info('file updating', file.name, file.size, file.type);
  const response = await session.fetch(destinationUrl, {
    body: file,
    headers: {
      'Content-Type': file.type,
    },
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error(`Failed to upload file: [${response.status}](${response.statusText})`);
  }
};

/*
const setPublicRead = async (session: Session, destinationUrl: string) => {
  let resourceAcl: AclDataset;
  const fileWithAcl = await getFileWithAcl(destinationUrl, { fetch: session.fetch });
  if (!fileWithAcl) {
    throw new Error('Failed to get file with acl');
  }
  const fileWithAclTyped = fileWithAcl as WithFallbackAcl & WithServerResourceInfo & WithAccessibleAcl;
  if (!hasResourceAcl(fileWithAclTyped)) {
    if (fileWithAclTyped.internal_acl.fallbackAcl) {
      resourceAcl = createAclFromFallbackAcl(fileWithAclTyped);
    } else {
      resourceAcl = createAcl(fileWithAclTyped);
    }
  } else {
    resourceAcl = getResourceAcl(fileWithAclTyped);
  }

  resourceAcl = setAgentResourceAccess(
    resourceAcl, 
    FOAF.Agent, 
    {
      append: false,
      control: false,
      read: true,
      write: false,
    }
  );
  await saveAclFor(fileWithAclTyped, resourceAcl, { fetch: session.fetch });
};
*/

const setProfileAvatar = async (session: Session, destinationUrl: string) => {
  const webId = session.info.webId as string;
  const profileDataset = await getSolidDataset(webId, { fetch: session.fetch });
  if (!profileDataset) {
    throw new Error('Failed to get profile dataset');
  }
  const profileThing = getThing(profileDataset, webId);
  if (!profileThing) {
    throw new Error('Failed to get profile thing');
  }
  const updatedProfile = setUrl(profileThing, VCARD.hasPhoto, destinationUrl);
  const updatedDataset = setThing(profileDataset, updatedProfile);
  await saveSolidDatasetAt(webId, updatedDataset, { fetch: session.fetch });
};

const AvatarWithUpload = memo<AvatarWithUploadProps>(({ size = 40, ...rest }) => {
  const updateAvatar = useUserStore((s) => s.updateAvatar);
  const [user, setUser] = useSolidStore((state) => [state.user, state.setUser]);
  const { session } = useSession();

  if (!session?.info.webId) return null;
  const containerUrl = avatars_container(session.info.webId);

  const handleUploadAvatar = async (file: any) => {
    if (!file || !session?.info.webId) return;

    try {
      // 1. 上传文件
      const destinationUrl = `${containerUrl}/${file.name}`;
      console.log('destinationUrl', destinationUrl);
      await uploadFile(session, file, destinationUrl);
      console.log('upload file success', file.name);

      // 2. 设置访问权限
      // await setPublicRead(session, destinationUrl);
      //console.log('set public read success');

      // 3. 更新 profile
      await setProfileAvatar(session, destinationUrl);
      console.log('set profile avatar success');

      // 4. 更新本地状态
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const image = reader.result as string;
        updateAvatar(image);
        console.log('update component user avatar success');
        setUser({ ...user, image });
        console.log('update local solid user avatar success');
      });
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('failed to upload avatar:', error);
    }
  };

  return (
    <Upload beforeUpload={handleUploadAvatar} itemRender={() => void 0} maxCount={1}>
      <UserAvatar clickable size={size} {...rest} />
    </Upload>
  );
});

export default AvatarWithUpload;
