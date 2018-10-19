import {
  FontIcon,
  IconButton,
  Paper,
} from "material-ui";
import * as React from "react";
import { Link } from "react-router-dom";
import { UserData } from "../models";
import { Snack } from "./snack";
import { TopicListItem } from "./topic-list-item";
import { findTopics } from "../gql/topic.gql";
import { findTopics as findTopicsResult, findTopicsVariables } from "../gql/_gql/findTopics";
import { Query } from "react-apollo";

interface TopicFavoProps {
  userData: UserData;
  detail: boolean;
}

interface TopicFavoState {
}

export class TopicFavo extends React.Component<TopicFavoProps, TopicFavoState> {
  constructor(props: TopicFavoProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <div>
      <Query<findTopicsResult, findTopicsVariables>
        query={findTopics}
        variables={{ query: { id: this.props.userData.storage.topicFavo.toArray() } }}>
        {({ loading, error, data, refetch }) => {
          return <>
            <IconButton onClick={() => refetch()} >
              <FontIcon className="material-icons">refresh</FontIcon>
            </IconButton>
            {
              (() => {
                if (loading) return "Loading...";
                if (error || !data) return (<Snack msg="トピック取得に失敗しました" />);

                const topics = data.topics.sort((a, b) => a.update > b.update ? -1 : a.update < b.update ? 1 : 0);

                return (
                  <Paper>
                    {topics.length !== 0 ?
                      topics.map(topic => <TopicListItem
                        key={topic.id}
                        topic={topic}
                        detail={this.props.detail} />)
                      : <div>
                        お気に入りトピックがありません。
                          <br />
                        <Link to="/topic/search">トピック一覧</Link>
                      </div>}
                  </Paper>
                );
              })()
            }
          </>;
        }}
      </Query>
    </div>;
  }
}
