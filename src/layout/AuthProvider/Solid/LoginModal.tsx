'use client';

import { User } from '@auth/core/types';
import { LoginButton, useSession } from '@inrupt/solid-ui-react';
import { Avatar } from '@lobehub/ui';
import { Button, Flex, Modal, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CLIENT_NAME, SOLID_ISSUER } from '@/const/solid';
import { SESSION_CHAT_URL } from '@/const/url';
import { getLogo, getProvider, getUserName } from '@/helpers/solid';
import { useSolidSession } from '@/hooks/useSolidSession';
import { useSolidStore } from '@/store/solid';

const { Title } = Typography;

const styles = {
  buttonArea: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
    marginTop: 'auto',
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
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as const,
    gap: 16,
    justifyContent: 'center',
    padding: '24px 0',
  },
  textArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
};

interface UserLoginProps {
  onCancel?: () => void;
  onError?: () => void;
  onSwitch?: () => void;
  sessionInProgress?: boolean;
  user?: User;
}

const getRedirectUrl = () => {
  return window.location.origin + SESSION_CHAT_URL();
};

const NewUserLogin = ({ sessionInProgress }: UserLoginProps) => {
  const { t } = useTranslation('solid');
  const [lastOidcIssuer, setLastOidcIssuer] = useSolidStore((state) => [
    state.oidcIssuer,
    state.setOidcIssuer,
  ]);
  const [oidcIssuer, setOidcIssuer] = useState(lastOidcIssuer || SOLID_ISSUER.undefineds);
  const redirectUrl = getRedirectUrl();
  console.info('NewUserLogin', oidcIssuer);

  const handleChange = (value: string) => {
    setOidcIssuer(value);
  };

  return (
    //<Flex align='center' gap={20} justify='center' style={{height: 400, margin: '0 auto', width: 200 }} vertical>
    <Flex style={styles.container} vertical>
      <Flex style={styles.content} vertical>
        <Avatar
          alt="ProviderLogo"
          avatar={getLogo(oidcIssuer)}
          shape="square"
          size={120}
          style={{ pointerEvents: 'none' }}
        />
      </Flex>
      <Flex style={styles.textArea}>
        {sessionInProgress ? <Title level={3}>{t('sessionInProgress')}</Title> : null}
      </Flex>
      <Flex style={styles.buttonArea} vertical>
        <Select onChange={handleChange} style={{ marginTop: '80px', width: '100%' }}>
          <Select.Option value={SOLID_ISSUER.undefineds}>Undefineds</Select.Option>
          <Select.Option value={SOLID_ISSUER.develop}>Undefineds(dev)</Select.Option>
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

const OldUserLogin: React.FC<UserLoginProps> = ({ user, onSwitch, onError, sessionInProgress }) => {
  const { t } = useTranslation('solid');
  const redirectUrl = getRedirectUrl();

  if (!user || !user.id) {
    throw new Error('No user found');
  }
  const oidcIssuer = new URL(user.id).origin;
  console.info('OldUserLogin', oidcIssuer, JSON.stringify(user));

  const image = user.image || getLogo(getProvider(user.id));
  const name = user.name || getUserName(user.id);

  return (
    <Flex style={styles.container} vertical>
      <Flex style={styles.content} vertical>
        <Avatar
          alt="ProfileImage"
          avatar={image}
          shape="square"
          size={120}
          style={{ pointerEvents: 'none' }}
        />
        <Title level={3}>{name}</Title>
      </Flex>
      <Flex style={styles.textArea}>
        {sessionInProgress ? <Title level={3}>{t('sessionInProgress')}</Title> : null}
      </Flex>
      <Flex style={styles.buttonArea} vertical>
        <LoginButton
          authOptions={{ clientName: CLIENT_NAME }}
          oidcIssuer={oidcIssuer}
          onError={onError}
          redirectUrl={redirectUrl}
        >
          <Button style={{ width: '100%' }} type="primary">
            {t('login')}
          </Button>
        </LoginButton>
        <Button onClick={onSwitch} type="text">
          {t('switch')}
        </Button>
      </Flex>
    </Flex>
  );
};

const ErrorLogin: React.FC<UserLoginProps> = ({ user, onCancel }) => {
  const { t } = useTranslation('solid');
  const redirectUrl = getRedirectUrl();

  if (!user || !user.id) {
    throw new Error('No user found');
  }
  const oidcIssuer = new URL(user.id).origin;
  console.info('OldUserLogin', oidcIssuer, user);

  const image = user.image || getLogo(getProvider(user.id));
  const name = user.name || getUserName(user.id);

  return (
    <Flex style={styles.container} vertical>
      <Flex style={styles.content} vertical>
        <Avatar
          alt="ProfileImage"
          avatar={image}
          shape="square"
          size={120}
          style={{ pointerEvents: 'none' }}
        />
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
            {t('retry')}
          </Button>
        </LoginButton>
        <Button onClick={onCancel} type="text">
          {t('cancel')}
        </Button>
      </Flex>
    </Flex>
  );
};

const UserLogin = ({ sessionInProgress }: UserLoginProps) => {
  const [profile, setCurrentUrl] = useSolidStore((state) => [state.profile, state.setCurrentUrl]);
  const [isNew, setIsNew] = useState(!profile?.id);
  const [isErr, setIsErr] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return isErr ? (
    <ErrorLogin
      onCancel={() => {
        setIsErr(false);
        setIsNew(true);
      }}
      user={profile as User}
    />
  ) : isNew ? (
    <NewUserLogin sessionInProgress={sessionInProgress} />
  ) : (
    <OldUserLogin
      onError={() => setIsErr(true)}
      onSwitch={() => setIsNew(true)}
      sessionInProgress={sessionInProgress}
      user={profile as User}
    />
  );
};

/*
const UserLoginInProgress = async () => {
  const { user } = await useSolidSession();
  console.info('UserLoginInProgress', user);
  const image = user?.image || getLogo(getProvider(user?.id || ''));
  const name = user?.name || getUserName(user?.id || '');
  return (
    <Flex style={styles.container} vertical>
      <Flex style={styles.content} vertical>
        <Avatar
          alt="ProfileImage"
          avatar={image}
          shape="square"
          size={120}
          style={{ pointerEvents: 'none' }}
        />
        <Title level={4}>{name}</Title>
      </Flex>
    </Flex>
  );
};
*/

const LoginModal = () => {
  const { isLoggedIn, user } = useSolidSession();
  const { sessionRequestInProgress } = useSession();
  const [setProfile] = useSolidStore((state) => [state.setProfile]);

  useEffect(() => {
    if (isLoggedIn && user) {
      console.info('Set Solid profile', JSON.stringify(user));
      setProfile(user);
      // window.fetch = session.fetch.bind(session);
    }
  }, [isLoggedIn, user]);

  return (
    <Modal closable={false} footer={null} open={!isLoggedIn} width="280px">
      <UserLogin sessionInProgress={sessionRequestInProgress} />
    </Modal>
  );
};

export default LoginModal;
