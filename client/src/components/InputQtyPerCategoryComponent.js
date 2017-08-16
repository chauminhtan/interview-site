import React, { Component } from "react";
import TextField from 'material-ui/TextField';

class InputQtyPerCategory extends Component {

    onChange = (e) => {
        const { category, language, name, value } = this.props;
        let data = { category, language, name, value };
        const qty = parseInt(e.target.value, 10);
        data.value = qty ? qty : 0;
        // console.log(data);
        this.props.onChange(data);
    }

    render() {
        const { category, language, name, value } = this.props;
        // console.log(this.props);
        return (
            <TextField id={name}
                fullWidth={false}
                hintText="Number Field"
                floatingLabelText={language + ' - ' + category}
                onChange={this.onChange}
                value={value}
                style={{ marginRight: '20px' }}
                />
        );
    }
}

export default InputQtyPerCategory;
