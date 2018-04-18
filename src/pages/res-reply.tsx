import { Paper } from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Res, Snack } from "../components";
import { ResSeted } from "../models";
import { myInject, UserStore } from "../stores";
import {
  apiClient,
  list,
  resSetedCreate,
  withModal,
} from "../utils";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react";

import * as Im from "immutable";

interface ResReplyBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
}

interface ResReplyBaseState {
  reses: Im.List<ResSeted> | null;
  snackMsg: null | string;
}

const ResReplyBase = withRouter(myInject(["user"], observer(class extends React.Component<ResReplyBaseProps, ResReplyBaseState> {
  constructor(props: ResReplyBaseProps) {
    super(props);
    this.state = {
      reses: null,
      snackMsg: null,
    };

    const token = this.props.user.data !== null ? this.props.user.data.token : null;

    apiClient.findResReply(token, {
      reply: this.props.match.params.id,
    })
      .mergeMap(reses => resSetedCreate.resSet(token, reses))
      .map(reses => Im.List(reses))
      .subscribe(reses => {
        this.setState({ reses });
      }, () => {
        this.setState({ snackMsg: "レス取得に失敗しました" });
      });
  }

  render() {
    return <div>
      <Helmet>
        <title>リプライ</title>
      </Helmet>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      {this.state.reses !== null
        ? this.state.reses.map(res => <Paper key={res.id}>
          <Res
            res={res}
            update={updateRes => {
              if (this.state.reses !== null) {
                this.setState({ reses: list.update(this.state.reses, updateRes) });
              }
            }} />
        </Paper>)
        : null}
    </div>;
  }
})));

export function ResReplyPage() {
  return <Page><ResReplyBase /></Page>;
}

export const ResReplyModal = withModal(() => <ResReplyBase />, "リプライ");
