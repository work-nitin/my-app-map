import React, {Component} from 'react';
import LocationItem from './LocationItem';
class ListPlaces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'locations': '',
            'query': '',
            'filters': true,
        };

        this.filterLocations = this.filterLocations.bind(this);
        this.togglefilters = this.togglefilters.bind(this);
    }

    /* Locations filteration based on user query and used toLowerCase func to account for both uppercase or lower case letters*/
    filterLocations(event) {
        this.props.closeInfoWindow();
        const {value} = event.target;
        var locations = [];
        this.props.LocationData.forEach(function (location) {
            if (location.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            'locations': locations,
            'query': value
        });
    }
/* setState() in componentWillMount() for the first render. Refer
here for more info hhttps://developmentarc.gitbooks.io/react-indepth/content/life_cycle/birth/premounting_with_componentwillmount.html */
    componentWillMount() {
        this.setState({
            'locations': this.props.LocationData
        });
    }

    /*Show and hide filters*/
    togglefilters() {
        this.setState({
            'filters': !this.state.filters
        });
    }

    /* Render LocationList to UI*/
    render() {
        var locationlist = this.state.locations.map(function (listItem, index) {
            return (
                <LocationItem key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}/>
            );
        }, this);

        return (
            <div className="search-filter">
                <input role="search-filter" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Filter"
                       value={this.state.query} onChange={this.filterLocations}/>
                <ul>
                    {this.state.filters && locationlist}
                </ul>
                <button className="button" onClick={this.togglefilters}>Click to hide</button>
            </div>
        );
    }
}

export default ListPlaces;
