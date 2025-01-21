import { User } from '@auth/core/types';
import {
  type SolidDataset,
  type Thing,
  getStringNoLocale,
  getThing,
  getUrl,
} from '@inrupt/solid-client';
import { Session } from '@inrupt/solid-client-authn-browser';
import { FOAF, VCARD } from '@inrupt/vocab-common-rdf';

import { SOLID_ISSUER, iconUrl } from '@/const/solid';

const fetchImageAsBase64 = async (session: Session, url: string): Promise<string | null> => {
  try {
    const response = await session.fetch(url, {
      headers: {
        Accept: 'image/png',
      },
    });
    if (!response.ok) {
      throw new Error(`[${response.status}:${response.statusText}]${url}`);
    }
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.addEventListener('loadend', () => resolve(reader.result as string));
      reader.addEventListener('error', reject);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

export const getProvider = (webId: string) => {
  const url = new URL(webId);
  const pathname = url.pathname;
  const segments = pathname.split('/').find((segment) => segment.length > 0);
  return segments || '';
};

export const getLogo = (oidcIssuer: string) => {
  switch (oidcIssuer) {
    case SOLID_ISSUER.undefineds: {
      return iconUrl('undefineds.svg');
    }
    case SOLID_ISSUER.community: {
      return iconUrl('community.svg');
    }
    case SOLID_ISSUER.inrupt: {
      return iconUrl('inrupt.svg');
    }
    case SOLID_ISSUER.local: {
      return iconUrl('undefineds.svg');
    }
    default: {
      return iconUrl('undefineds.svg');
    }
  }
};

const getImage = async (session: Session, profile: Thing) => {
  const url = getUrl(profile, VCARD.hasPhoto) || getUrl(profile, FOAF.img);
  if (!url) {
    return null;
  }
  try {
    return await fetchImageAsBase64(session, url);
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

const getFullName = (profile: Thing) => {
  return getStringNoLocale(profile, VCARD.fn) || getStringNoLocale(profile, FOAF.name);
};

export const getUserName = (webId: string) => {
  const url = new URL(webId);
  const pathname = url.pathname;
  const segments = pathname.split('/').find((segment) => segment.length > 0);
  return segments || '';
};

export const getUser = async (session: Session, card: SolidDataset | null) => {
  const profile = card ? getThing(card, session.info.webId!) : null;
  const provider = getProvider(session.info.webId!);
  const user: User = {
    id: session.info.webId!,
    image: profile ? await getImage(session, profile) : getLogo(provider),
    name: profile ? getFullName(profile) : getUserName(session.info.webId!),
  };
  return user;
};
