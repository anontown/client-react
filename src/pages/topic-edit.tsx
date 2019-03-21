import { Paper } from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Page,
  TopicEditor,
} from "../components";
import {
  withModal,
  userSwitch,
  UserSwitchProps,
  queryResultConvert,
} from "../utils";
import * as G from "../../generated/graphql";

type TopicEditBaseProps = RouteComponentProps<{ id: string }> & UserSwitchProps & {
  zDepth?: number;
};

const TopicEditBase = withRouter(userSwitch((props: TopicEditBaseProps) => {
  const topics = G.useFindTopicsQuery({
    variables: {
      query: {
        id: [props.match.params.id]
      }
    }
  });
  queryResultConvert(topics);
  const topic = topics.data !== undefined ? topics.data.topics[0] : null;

  return <Paper zDepth={props.zDepth}>
    <Helmet>
      <title>トピック編集</title>
    </Helmet>
    {topic !== null && topic.__typename === "TopicNormal"
      ? <TopicEditor topic={topic} userData={props.userData} />
      : null}
  </Paper>;
}));

export function TopicEditPage() {
  return <Page><TopicEditBase /></Page>;
}

export const TopicEditModal = withModal(() => <TopicEditBase zDepth={0} />, "トピック編集");
