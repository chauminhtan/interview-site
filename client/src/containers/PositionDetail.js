import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { Helmet } from 'react-helmet';
import PositionsApi from '../api/Positions';
import LangsApi from '../api/Languages';
import PositionDetailComponent from '../components/PositionDetailComponent';
import Header from '../components/Header';

class PositionDetail extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            position: null,
            languages: null
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        console.log('componentDidMoun');
        this.getLanguageData();
        this.setState({loading: true}, this.updateData);
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        // Check to see if the requestRefresh prop has changed
    }

    // Callback from the `UsersComponent` component
    onComponentRefresh = () => {
        console.log('refreshing data..');
        this.setState({ loading: true }, this.updateData);
    }

    getLanguageData = () => {
        LangsApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                languages: res.data
            });
        })
    }

    updateData = () => {
        const id = this.props.match.params.id;
        PositionsApi.getOne(id, res => {
            // console.log(res);
            this.setState({
                loading: false,
                position: res.data,
            });
        })
    }

    render() {
        const { loading, position, languages } = this.state;
        const props = { position, languages };
        const { location } = this.props;

        return (
            <div>
                <Header location={location} title='Position Detail' />
                <Helmet>
                    <title>Interview System: Position Detail</title>
                </Helmet>
                <div className='MainContent'>
                    {!loading && position && languages ? <PositionDetailComponent onComponentRefresh={this.onComponentRefresh} {...props} /> : <CircularProgress className='loader'>Loading...</CircularProgress>}
                </div>
            </div>
        );
    }
}

export default PositionDetail;