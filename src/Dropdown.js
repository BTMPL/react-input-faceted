import React from "react";

export class FacetDropdownItem extends React.Component {

  handleSelect = () => {    
    this.props.onSelect(this.props.facet)
  }

  render() {

    const { facet, hilighted, template } = this.props;
    const Component = template || 'div'

    const props = {
      className: `facetsDropdown__Item ${hilighted ? 'active' : ''}`
    };
     if (template) props.facet = facet;    
    
    return (      
      <div onClick={this.handleSelect}>
        <Component {...props}>{facet.value}</Component>
      </div>
    )
  }
}

export class FacetsDropdown extends React.Component {
  render() {      
    const { facets, onChange, hilightedIndex } = this.props;
    console.log('fdr', facets.length);  
    return (
      <div className="facetsDropdown">
        {facets.map((facet, index) => <FacetDropdownItem 
                                        template={this.props.template} 
                                        hilighted={index === hilightedIndex} 
                                        facet={facet} 
                                        key={facet.value} 
                                        onSelect={onChange} 
                                      />)}
      </div>
    )
  }
}