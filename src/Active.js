import React from "react";

export class ActiveFacetsItem extends React.PureComponent {
  render() {
    const { facet } = this.props;

    return (
      <div className="activeFacets__Item">{facet.value}</div>
    )
  }
}

export class ActiveFacets extends React.PureComponent {
  render() {
    const { facets } = this.props;
    const Component = this.props.template || ActiveFacetsItem;
    return (
      <div className="activeFacets">
        {facets.map(facet => <Component facet={facet} key={facet.value} />)}
      </div>
    )
  }
}