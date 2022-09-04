import { Component, Fragment, h } from "preact";
// import React from "react";
export class ErrorBoundary extends Component {
  public state: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      //
      return (
        <Fragment>
          <h1>Something went wrong.</h1>
          {/* <div>{this.state.error}</div> */}
        </Fragment>
      );
    }

    return this.props.children;
  }
}
