import React from 'react';
import { render } from 'react-dom';

import "../src/main.css";
import Input from "../src/index";

const facets = {
  person: [
    { 
      value: "BTM", 
      id: 1, 
      email: "baphemot@gmail.com" 
    },
    "John Doe"
  ],
  location: [
    'USA', 
    'Canada', 
    'United Kingdom', 
    'Brazil', 
    'Germany', 
    'France'
  ]
}

const CustomActiveFacet = ({ facet }) => <div>{facet._group}: {facet.value}</div>
const CustomDropdownFacet = ({facet}) => <div>Option: {facet.value}</div>

const App = () => {
  return (
    <div style={{maxWidth: '600px', margin: '0 auto', font: '14px/18px Tahoma, Verdana, sans-serif'}}>
      <p>
        Please start typing in the field below. You can use any string and also trigger the faceted search functionality by typing <b>person:</b> or <b>location:</b>
      </p>
      <Search />
      <br />
      <Search activeFacetTemplate={CustomActiveFacet} dropdownFacetTemplate={CustomDropdownFacet} />     
    </div>
  )
}


class Search extends React.Component {

  defaultProps = {
    activeFacetTemplate: undefined,
    dropdownFacetTemplate: undefined
  }

  state = {
    facets: null
  }

  getFacets = (facet, value) => {
    let facetsList = facets[facet];
    
    if(facetsList) {
      facetsList = facetsList.filter(facet => {
        if (typeof facet === 'object') return facet.value.toLowerCase().indexOf(value.toLowerCase()) > -1
        return facet.toLowerCase().indexOf(value.toLowerCase()) > -1
      })
      this.setState({
        facets: facetsList.length > 0 ? facetsList : null
      })
    }
    else if(this.state.facets) {
      this.setState({
        facets: null
      })
    }
  }

  setFacets = (facets) => {
    this.setState({
      facets: null,
      activeFacets: facets
    })
  }

  render() {
    return (
      <div>
        <Input

          dropdownFacetTemplate={this.props.dropdownFacetTemplate}
          activeFacetTemplate={this.props.activeFacetTemplate}

          getFacets={this.getFacets}
          setFacets={this.setFacets}
          facets={this.state.facets}
        />
        <pre>
          {JSON.stringify(this.state.activeFacets, null, 2)}
        </pre>
      </div>         
    )
  }
}

render(<App />, document.body);
