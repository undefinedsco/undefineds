import { withBasePath } from '@/utils/basePath';

export const iconUrl = (filename: string) => withBasePath(`/solid/${filename}`);

export const SOLID_ISSUER = {
  community: 'https://solidcommunity.net',
  develop: 'https://ohqksmsmnlby.gzg.sealos.run',
  inrupt: 'https://login.inrupt.com',
  local: 'http://localhost:3000',
  undefineds: 'https://lgnxxsoohipf.sealosgzg.site',
};

export const CLIENT_NAME = 'https://undefineds.co/linq';

export const avatars_container = (webId: string) => {
  const containerUrl = webId.split('/').slice(0, -2).join('/') + '/public/avatars';
  return containerUrl;
};
