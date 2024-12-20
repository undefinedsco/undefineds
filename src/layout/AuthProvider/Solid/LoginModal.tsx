/* eslint-disable sort-keys-fix/sort-keys-fix */
'use client';

import { User } from '@auth/core/types';
import { LoginButton, useSession } from '@inrupt/solid-ui-react';
import { Avatar } from '@lobehub/ui';
import { Button, Flex, Image, Modal, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CLIENT_NAME, SOLID_ISSUER } from '@/const/solid';
import { SESSION_CHAT_URL } from '@/const/url';
import { getLogo, getProvider, getUserName } from '@/helpers/solid';
import { useSolidSession } from '@/hooks/useSolidSession';
import { useSolidStore } from '@/store/solid';

/* eslint-disable sort-keys-fix/sort-keys-fix */

/* eslint-disable sort-keys-fix/sort-keys-fix */

/* eslint-disable sort-keys-fix/sort-keys-fix */

/* eslint-disable sort-keys-fix/sort-keys-fix */

/* eslint-disable sort-keys-fix/sort-keys-fix */

/* eslint-disable sort-keys-fix/sort-keys-fix */

/* eslint-disable sort-keys-fix/sort-keys-fix */

/* eslint-disable sort-keys-fix/sort-keys-fix */

/* eslint-disable sort-keys-fix/sort-keys-fix */

const { Title } = Typography;

const styles = {
  buttonArea: {
    display: 'flex',
    marginTop: 'auto',
    flexDirection: 'column' as const,
    gap: 8,
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
    height: 400,
    justifyContent: 'center',
    margin: '0 auto',
    width: 200,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: '24px 0',
  },
};

interface UserLoginProps {
  onSwitchUser: () => void;
  user: User;
}

const getRedirectUrl = () => {
  return window.location.origin + SESSION_CHAT_URL();
};

const NewUserLogin = () => {
  const { t } = useTranslation('solid');
  const [lastOidcIssuer, setLastOidcIssuer] = useSolidStore((state) => [
    state.oidcIssuer,
    state.setOidcIssuer,
  ]);
  const [oidcIssuer, setOidcIssuer] = useState(lastOidcIssuer || SOLID_ISSUER.undefineds);
  const redirectUrl = getRedirectUrl();
  console.info('NewUserLogin', oidcIssuer, window.location.href);

  const handleChange = (value: string) => {
    setOidcIssuer(value);
  };

  return (
    //<Flex align='center' gap={20} justify='center' style={{height: 400, margin: '0 auto', width: 200 }} vertical>
    <Flex style={styles.container} vertical>
      <Flex style={styles.content} vertical>
        <Image
          alt="ProviderLogo"
          height={120}
          preview={false}
          src={getLogo(oidcIssuer)}
          style={{ pointerEvents: 'none' }}
          width={120}
        />
      </Flex>
      <Flex style={styles.buttonArea} vertical>
        <Select onChange={handleChange} style={{ marginTop: '80px', width: '100%' }}>
          <Select.Option value={SOLID_ISSUER.undefineds}>Undefineds</Select.Option>
          <Select.Option value={SOLID_ISSUER.community}>Community</Select.Option>
          <Select.Option value={SOLID_ISSUER.inrupt}>Inrupt</Select.Option>
          <Select.Option value={SOLID_ISSUER.local}>Local</Select.Option>
        </Select>
        <LoginButton
          authOptions={{ clientName: CLIENT_NAME }}
          oidcIssuer={oidcIssuer}
          onError={console.error}
          redirectUrl={redirectUrl}
        >
          <Button
            onClick={() => setLastOidcIssuer(oidcIssuer)}
            style={{ width: '100%' }}
            type="primary"
          >
            {t('login')}
          </Button>
        </LoginButton>
      </Flex>
    </Flex>
  );
};

const OldUserLogin: React.FC<UserLoginProps> = ({ user, onSwitchUser }) => {
  const { t } = useTranslation('solid');
  const redirectUrl = getRedirectUrl();

  if (!user.id) {
    throw new Error('No webId found');
  }
  const oidcIssuer = new URL(user.id).origin;
  console.info('OldUserLogin', oidcIssuer, window.location.href);

  const image = user.image || getLogo(getProvider(user.id));
  const name = user.name || getUserName(user.id);

  return (
    <Flex style={styles.container} vertical>
      <Flex style={styles.content} vertical>
        <Avatar alt="ProfileImage" avatar={image} shape="square" size={120} />
        <Title level={3}>{name}</Title>
      </Flex>
      <Flex style={styles.buttonArea} vertical>
        <LoginButton
          authOptions={{ clientName: CLIENT_NAME }}
          oidcIssuer={oidcIssuer}
          onError={console.error}
          redirectUrl={redirectUrl}
        >
          <Button style={{ width: '100%' }} type="primary">
            {t('login')}
          </Button>
        </LoginButton>
        <Button onClick={onSwitchUser} type="text">
          {t('switch')}
        </Button>
      </Flex>
    </Flex>
  );
};

const UserLogin = () => {
  const [profile] = useSolidStore((state) => [state.profile]);
  const [isNew, setIsNew] = useState(!profile?.id);

  return isNew ? (
    <NewUserLogin />
  ) : (
    <OldUserLogin onSwitchUser={() => setIsNew(!isNew)} user={profile as User} />
  );
};

const UserLoginInProgress = () => {
  const { user } = useSolidSession();
  console.info('UserLoginInProgress', user);
  const image = user?.image || getLogo(getProvider(user?.id || ''));
  const name = user?.name || getUserName(user?.id || '');
  return (
    <Flex style={styles.container} vertical>
      <Flex style={styles.content} vertical>
        <Avatar alt="ProfileImage" avatar={image} shape="square" size={120} />
        <Title level={4}>{name}</Title>
      </Flex>
    </Flex>
  );
};

const LoginModal = () => {
  const { isLoggedIn, user } = useSolidSession();
  const { sessionRequestInProgress } = useSession();
  const [setProfile] = useSolidStore((state) => [state.setProfile]);

  useEffect(() => {
    if (isLoggedIn && user) {
      console.info('Set Solid profile', JSON.stringify(user));
      setProfile(user);
    }
  }, [isLoggedIn, user]);

  return (
    <Modal
      closable={false}
      footer={null}
      open={!isLoggedIn && !sessionRequestInProgress}
      width="280px"
    >
      {sessionRequestInProgress ? <UserLoginInProgress /> : <UserLogin />}
    </Modal>
  );
};

export default LoginModal;
