import React, { Component } from "react";

class Index extends Component {
    render() {
        
        return (
            <div className="App">
                <section>
                    <h2>container goes here</h2>
                    <div className="container">
                        {this.props.children}
                    </div>
                </section>
            </div>
        );
    }
}

export default Index;