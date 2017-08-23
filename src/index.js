import React from 'react';
import PropTypes from "prop-types";

import { FacetsDropdown, FacetDropdownItem } from "./Dropdown.js";
import { ActiveFacets, ActiveFacetsItem } from "./Active.js";


export default class extends React.Component {

  static propTypes = {
    clickToRemoveFacet: PropTypes.bool,
    preventDuplicates: PropTypes.bool,
    backspaceToRemove: PropTypes.bool,

    getFacets: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,

    facets: PropTypes.array,    
    dropdownFacetTemplate: PropTypes.func,
    activeFacetTemplate: PropTypes.func   
  }

  state = {
    activeFacets: [],
    hilightedIndex: -1,
    open: false,
    value: '',
  }

  static defaultProps = {
    clickToRemoveFacet: false,
    preventDuplicates: true,
    backspaceToRemove: true,

    facets: null,    
    dropdownFacetTemplate: null,
    activeFacetTemplate: null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.facets !== this.props.facets) {
      this.setState({
        open: nextProps.facets !== null
      })
    }
  }

  handleChange = (e) => {
    const { value } = e.target;

    const newState = {
      acceptFacets: false,
      value: value,
    }

    // check if the value contains a facet name
    if (value.indexOf(':') > -1) {
      const [match, group, string] = value.match(/([a-zA-Z0-9]+):(.*)/);
      this.props.getFacets(group, string);

      newState.group = group;
      newState.acceptFacets = true;
    }
    else if (this.state.open) {
      this.props.getFacets();
    }
    this.setState(newState);
    this.props.onChange(newState.value, newState.activeFacets);
  }

  handleFacetSet = (facet) => {
    const { group } = this.state;
    const activeFacets = [...this.state.activeFacets, { ...facet, _group: group }]


    this.setState((state) => {
      return {
        activeFacets,
        value: state.value.replace(new RegExp(`${group}:(.*)`, 'i'), ''),
        hilightedIndex: -1,
        acceptFacets: false
      }
    }, () => {
      this.props.onChange(this.state.value, this.state.activeFacets);
      this.inputNode.focus();
    })
  }

  handleKeyDown = (e) => {
    if (this.state.open) {
      if (e.key === 'ArrowDown') {
        this.setState({
          hilightedIndex: (this.state.hilightedIndex + 1) % this.prepareFacets(this.props.facets, true).length
        });
        e.preventDefault();
        return false;
      }
      else if (e.key === 'ArrowUp') {
        this.setState({
          hilightedIndex: (this.state.hilightedIndex - 1) % this.prepareFacets(this.props.facets, true).length
        });
        e.preventDefault();
        return false;
      }
      else if (e.key === 'Enter' && this.state.hilightedIndex > -1) {
        this.handleFacetSet(this.prepareFacets(this.props.facets, true)[this.state.hilightedIndex]);
        e.preventDefault();
        return false;
      }
    }


    if (e.key === 'Backspace' && this.props.backspaceToRemove && e.target.selectionStart === 0) {
      this.setState((state) => {
        const activeFacets = state.activeFacets.length > 0 ? state.activeFacets.slice(0, state.activeFacets.length - 1) : [];
        return {
          activeFacets
        }
      }, () => {
        this.props.onChange(this.state.value, this.state.activeFacets);
      })
    }
  }

  handleRemoveFacet = (remove) => {
    this.setState((state) => {
      return {
        activeFacets: state.activeFacets.filter(facet => facet !== remove)
      }
    }, () => {
      this.props.onChange(this.state.value, this.state.activeFacets);  
    })
  }

  prepareFacets = (facets, removeDuplicates = false) => {
    let normalizedFacets = facets.map(facet => {
      if (typeof facet !== 'object') facet = { value: facet };
      return facet;
    });

    if (removeDuplicates && this.state.activeFacets.length > 0) {
      normalizedFacets = normalizedFacets.filter(facet => {
        let keep = true;
        this.state.activeFacets.find(activeFacet => {
          if (activeFacet.value === facet.value && activeFacet._group === this.state.group) {
            keep = false;
          }
        })
        return keep;
      });
    }

    return normalizedFacets;
  }

  setRef = (el) => this.inputNode = el;

  render() {
    const { value, 
      acceptFacets, 
      activeFacets, 
      hilightedIndex,
     } = this.state;

    const { facets, 
      activeFacetTemplate, 
      dropdownFacetTemplate, 
      clickToRemoveFacet,
     } = this.props;

    return (
      <div className="reactFacets">
        <div className="reactFacets__Input">
          {activeFacets && <ActiveFacets 
                            clickToRemoveFacet={clickToRemoveFacet}
                            onRemove={this.handleRemoveFacet}
                            template={activeFacetTemplate} 
                            facets={this.prepareFacets(activeFacets)} />}

          <input type="text"
            ref={this.setRef}
            value={value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />

        </div>
        {acceptFacets && facets && <FacetsDropdown 
                    template={dropdownFacetTemplate} 
                    facets={this.prepareFacets(facets, true)}
                    hilightedIndex={hilightedIndex} 
                    onChange={this.handleFacetSet} />}
      </div>
    )
  }
}