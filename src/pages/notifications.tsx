import * as Im from "immutable";
import {
  Paper,
  RaisedButton,
} from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Page,
  Res,
  Snack,
} from "../components";
import {
  ResSeted,
  UserData,
} from "../models";
import { Store } from "../reducers";
import {
  apiClient,
  list,
  resSetedCreate,
} from "../utils";

interface NotificationsPageProps extends RouteComponentProps<{}> {
  user: UserData | null;
}

export interface NotificationsPageState {
  reses: Im.List<ResSeted>;
  snackMsg: null | string;
}

export const NotificationsPage = withRouter<{}>(connect((state: Store) => ({ user: state.user }))(class extends React.Component<NotificationsPageProps, NotificationsPageState> {
  private limit = 50;

  constructor(props: NotificationsPageProps) {
    super(props);
    this.state = {
      reses: Im.List(),
      snackMsg: null,
    };

    this.findNew();
  }

  public render() {
    return (
      <Page column={1}>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.props.user !== null
          ? <div>
            <div>
              <RaisedButton label="最新" onClick={() => this.readNew()} />
            </div>
            <div>
              {this.state.reses.map((r) => <Res res={r} isPop={false} update={(r) => this.update(r)} />)}
            </div>
            <div>
              <RaisedButton label="前" onClick={() => this.readOld()} />
            </div>
          </div>
          : <Paper>
            ログインしてください。
    </Paper>
        }
      </Page>
    );
  }

  public update(res: ResSeted) {
    this.setState({ reses: list.update(this.state.reses, res) });
  }

  public findNew() {
    if (this.props.user === null) {
      return;
    }
    const token = this.props.user.token;

    apiClient.findResNoticeNew(token,
      {
        limit: this.limit,
      })
      .mergeMap((reses) => resSetedCreate.resSet(token, reses))
      .map((reses) => Im.List(reses))
      .subscribe((reses) => {
        this.setState({ reses });
      }, () => {
        this.setState({ snackMsg: "レス取得に失敗" });
      });
  }

  public readNew() {
    if (this.props.user === null) {
      return;
    }

    const token = this.props.user.token;

    const first = this.state.reses.first();
    if (first === undefined) {
      this.findNew();
    } else {
      apiClient.findResNotice(token,
        {
          type: "after",
          equal: false,
          date: first.date,
          limit: this.limit,
        })
        .mergeMap((reses) => resSetedCreate.resSet(token, reses))
        .map((reses) => Im.List(reses))
        .map((reses) => reses.concat(this.state.reses))
        .subscribe((reses) => {
          this.setState({ reses });
        }, () => {
          this.setState({ snackMsg: "レス取得に失敗" });
        });
    }
  }

  public readOld() {
    if (this.props.user === null) {
      return;
    }

    const token = this.props.user.token;

    const last = this.state.reses.last();

    if (last === undefined) {
      this.findNew();
    } else {
      apiClient.findResNotice(token,
        {
          type: "before",
          equal: false,
          date: last.date,
          limit: this.limit,
        })
        .mergeMap((reses) => resSetedCreate.resSet(token, reses))
        .map((reses) => this.state.reses.concat(reses))
        .subscribe((reses) => {
          this.setState({ reses });
        }, () => {
          this.setState({ snackMsg: "レス取得に失敗" });
        });
    }
  }
}));
