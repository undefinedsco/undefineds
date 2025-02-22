import auth from './auth';
import chat from './chat';
import clerk from './clerk';
import common from './common';
import components from './components';
import discover from './discover';
import error from './error';
import file from './file';
import knowledgeBase from './knowledgeBase';
import metadata from './metadata';
import migration from './migration';
import modelProvider from './modelProvider';
import models from './models';
import plugin from './plugin';
import portal from './portal';
import providers from './providers';
import ragEval from './ragEval';
import setting from './setting';
import solid from './solid';
import thread from './thread';
import tool from './tool';
import topic from './topic';
import welcome from './welcome';

const resources = {
  auth,
  chat,
  clerk,
  common,
  components,
  discover,
  error,
  file,
  knowledgeBase,
  metadata,
  migration,
  modelProvider,
  models,
  plugin,
  portal,
  providers,
  ragEval,
  setting,
  solid,
  thread,
  tool,
  topic,
  welcome,
} as const;

export default resources;
