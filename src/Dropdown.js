import React from "react";

export class FacetDropdownItem extends React.PureComponent {
  render() {
    const { facet, onSelect, hilighted, template } = this.props;
    const Component = template || 'div'

    const props = {
      className: `facetsDropdown__Item ${hilighted ? 'active' : ''}`
    };
    if (template) props.facet = facet;

    return (
      <div onClick={() => onSelect(facet)}>
        <Component {...props}>{facet.value}</Component>
      </div>
    )
  }
}

export class FacetsDropdown extends React.Component {
  render() {
    const { facets, onChange, hilightedIndex } = this.props;
    return (
      <div className="facetsDropdown">
        {facets.map((facet, index) => <FacetDropdownItem template={this.props.template} hilighted={index === hilightedIndex} facet={facet} key={facet.value} onSelect={onChange} />)}
      </div>
    )
  }
}