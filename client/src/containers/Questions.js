import React, { Component } from 'react';
import Header from '../components/Header';
import QuestionsComponent from '../components/QuestionsComponent';
import CircularProgress from 'material-ui/CircularProgress';

class Questions extends Component {
    constructor (props) {
        super(props);

        this.state = {
            loading: false
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        this.setState({loading: true});
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps');
    }

    // Callback from the `UsersComponent` component
    onComponentRefresh = () => {
        this.setState({loading: false});
    }

    render() {
        const { loading } =  this.state;
        const { location } = this.props;

        return (
            <div>
                <Header location={location} title='Questions' />
                <div className='MainContent'>
                    {loading && <CircularProgress />}
                    <QuestionsComponent onComponentRefresh={this.onComponentRefresh} />
                </div>
            </div>
        );
    }
}

export default Questions;