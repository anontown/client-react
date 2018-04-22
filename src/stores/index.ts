export * from "./user-store";
export * from "./topic-search-store";
export * from "./profiles-store";
export * from "./res-store";

import { inject } from "mobx-react";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { UserStore } from "./user-store";
import { TopicSearchStore } from "./topic-search-store";
import { ProfilesStore } from "./profiles-store";
import { ResStore } from "./res-store";

const userStore = new UserStore();

export const stores = {
  user: userStore,
  topicSearch: new TopicSearchStore(),
  profiles: new ProfilesStore(userStore),
  res: new ResStore(userStore)
};

export type Stores = typeof stores;

export const myInject =
  (<P, N extends keyof Stores>(names: N[], c: React.ComponentType<P>) =>
    inject(...names)(c) as any as React.ComponentType<ObjectOmit<P, N>>);
