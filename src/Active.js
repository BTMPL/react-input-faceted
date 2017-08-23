import React from "react";

export class ActiveFacetsItem extends React.PureComponent {

  handleClick = () => {
    if(this.props.clickToRemoveFacet) {
      this.props.onRemove(this.props.facet);
    }
  }
  render() {
    const { facet, clickToRemoveFacet } = this.props;  

    return (
      <div className={`activeFacets__Item ${clickToRemoveFacet ? 'activeFacets__Item--ctr': ''}`}
        onClick={this.handleClick}>
          {facet.value}
      </div>
    )
  }
}

export class ActiveFacets extends React.PureComponent {

  handleRemove = (facet) => this.props.onRemove(facet);
  
  render() {
    const { facets,
      clickToRemoveFacet,
    } = this.props;

    const Component = this.props.template || ActiveFacetsItem;
    return (
      <div className="activeFacets">
        {facets.map(facet => <Component 
                                onRemove={this.handleRemove} 
                                clickToRemoveFacet={clickToRemoveFacet} 
                                facet={facet} 
                                key={facet.value} 
                              />)}
      </div>
    )
  }
}