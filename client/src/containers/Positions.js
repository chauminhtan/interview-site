import React, { Component } from 'react';
import Header from '../components/Header';
import PositionsComponent from '../components/PositionsComponent';
import CircularProgress from 'material-ui/CircularProgress';
import PositionsApi from '../api/Positions';
import LangsApi from '../api/Languages';

class Tests extends Component {
    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            positions: null,
            languages: null
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        this.getLanguageData();
        this.setState({ loading: true }, this.updateData);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps');
    }

    // Callback from the `UsersComponent` component
    onComponentRefresh = (data) => {
        console.log('refreshing data..', data);
        if (data === 'language') {
            this.getLanguageData();
        }
        this.setState({ loading: true }, this.updateData);
    }

    // Call out to server data and refresh directory
    getLanguageData = () => {
        LangsApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                languages: res.data
            });
        })
    }

    // Call out to server data and refresh directory
    updateData = () => {
        PositionsApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                positions: res.data,
            });
        })
    }

    render() {
        const { loading, positions, languages } =  this.state;
        const { location } = this.props;
        const props = { positions, languages };
        console.log(props);

        return (
            <div>
                <Header location={location} title='Positions' />
                <div className='MainContent'>
                {!loading && positions && languages ? <PositionsComponent onComponentRefresh={this.onComponentRefresh} {...props} /> : <CircularProgress />}
                </div>
            </div>
        );
    }
}

export default Tests;