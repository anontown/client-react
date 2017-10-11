import * as React from 'react';

export interface PageProps {
  column: 1 | 2
}

export interface PageState {
}

export class Page extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }


}