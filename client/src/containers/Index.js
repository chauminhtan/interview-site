import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";

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
                <Footer />
            </div>
        );
    }
}

export default Index;