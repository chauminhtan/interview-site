import React, { Component } from 'react';
import Header from '../components/Header';
import QuestionsComponent from '../components/QuestionsComponent';
import CircularProgress from 'material-ui/CircularProgress';
import QuestionsApi from '../api/Questions';
import LangsApi from '../api/Languages';

class Questions extends Component {
    
    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            questions: null,
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
        QuestionsApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                questions: res.data,
            });
        })
    }

    render() {
        const { loading, questions, languages } =  this.state;
        const { location } = this.props;
        const props = { questions, languages };
        // console.log(languages);

        return (
            <div>
                <Header location={location} title='Questions' />
                <div className='MainContent'>
                    {!loading && questions && languages ? <QuestionsComponent onComponentRefresh={this.onComponentRefresh} {...props} /> : <CircularProgress />}
                </div>
            </div>
        );
    }
}

export default Questions;