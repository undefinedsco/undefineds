import { User } from '@auth/core/types';
import {
  type SolidDataset,
  type Thing,
  getStringNoLocale,
  getThing,
  getUrl,
} from '@inrupt/solid-client';
import { FOAF, VCARD } from '@inrupt/vocab-common-rdf';

import { SOLID_ISSUER, iconUrl } from '@/const/solid';

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

const getImage = (profile: Thing) => {
  return getUrl(profile, VCARD.hasPhoto) || getUrl(profile, FOAF.img);
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

export const getUser = (webId: string, card: SolidDataset | null) => {
  const profile = card ? getThing(card, webId) : null;
  const provider = getProvider(webId);
  const user: User = {
    id: webId,
    image: profile ? getImage(profile) : getLogo(provider),
    name: profile ? getFullName(profile) : getUserName(webId),
  };
  return user;
};
